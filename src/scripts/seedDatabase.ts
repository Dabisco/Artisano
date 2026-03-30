import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from "@/types/database.types.js";
import { CatError, SkillError, StateError, LgaError } from "./errors.js";

// 1. Setup Environment and Database Connection
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

// We use the Service Role Key because Admin rights are required to bypass RLS policies during seeding
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper for ESM directory resolving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Define Starter Categories, Occupations, and Skills
const INITIAL_CATEGORIES = [
  {
    name: "Home Maintenance",
    occupations: ["Plumber", "Electrician", "Carpenter", "Painter"]
  },
  {
    name: "Electronics & Tech",
    occupations: ["AC Repair Technician", "Phone Repair", "Computer Technician"]
  },
  {
    name: "Automotive",
    occupations: ["Auto Mechanic", "Vulcanizer", "Panel Beater"]
  }
];

const INITIAL_SKILLS = [
  "Pipe Installation", "Leak Repair", "Wiring", "Circuit Board Repair", 
  "Engine Diagnostics", "Tire Alignment", "Painting", "Woodworking"
];

// 3. Main Seeding Function
const seedDatabase = async () => {
    console.log("🌱 Starting Database Seed...");

    try {
        // --- STEP A: Seed Categories and Occupations ---
        console.log("1. Seeding Categories & Occupations...");
        for (const cat of INITIAL_CATEGORIES) {
            // Insert Category
            const { data: categoryData, error: catError } = await supabase
                .from('categories')
                .upsert({ name: cat.name }, { onConflict: 'name' }) // If it already exists, just update it
                .select('id')
                .single();
            
            if (catError) throw new CatError(`Failed to seed Category ${cat.name}`, catError);

            if (categoryData && categoryData.id) {
                // Insert Occupations tied to this Category ID
                for (const occName of cat.occupations) {
                    const { error: occError } = await supabase
                        .from('occupations')
                        .upsert({ name: occName, category_id: categoryData.id }, { onConflict: 'name' });
                    
                    if (occError) throw new CatError(`Failed to seed Occupation ${occName} within Category ${cat.name}`, occError);
                }
            }
        }
        console.log("✅ Categories & Occupations Seeded.");

        // --- STEP B: Seed Skills ---
        console.log("2. Seeding Starter Skills...");
        for (const skill of INITIAL_SKILLS) {
             const { error: skillError } = await supabase
                .from('skills')
                .upsert({ name: skill }, { onConflict: 'name' });
            if (skillError) throw new SkillError(`Failed to seed Skill ${skill}`, skillError);
        }
        console.log("✅ Skills Seeded.");

        // --- STEP C: Seed States and LGAs ---
        console.log("3. Seeding Nigeria States & LGAs...");
        
        // Read the JSON file you provided
        const locationsPath = path.join(__dirname, '../../data/nigeria-states-lgas.json');
        const locationsData = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));

        for (const location of locationsData) {
            // Insert State
            const { data: stateData, error: stateError } = await supabase
                .from('states')
                .upsert({ name: location.state }, { onConflict: 'name' })
                .select('id')
                .single();

            if (stateError) throw new StateError(`Failed to seed State ${location.state}`, stateError);

            if (stateData && stateData.id) {
                // Ensure LGAs are unique within the array to prevent PostgreSQL bulk insert errors
                const uniqueLgas = [...new Set<string>(location.lgas)];

                // Insert LGAs tied to this State ID
                const lgasToInsert = uniqueLgas.map((lgaName: string) => ({
                    name: lgaName,
                    state_id: stateData.id
                }));

                // We can insert all LGAs for a state in one bulk operation for speed
                const { error: lgaError } = await supabase
                    .from('lgas')
                    .upsert(lgasToInsert, { onConflict: 'state_id, name' }); // Respects our UNIQUE(state_id, name) constraint

                if (lgaError) throw new LgaError(`Failed to bulk insert LGAs for State ${location.state}`, lgaError);
            }
        }
        console.log("✅ States & LGAs Seeded.");

        console.log("🎉 Database Seed Complete!");

    } catch (error: any) {
        if (error instanceof CatError) {
             console.error(`❌ Category Error: ${error.message}`, error.originalError);
        } else if (error instanceof SkillError) {
             console.error(`❌ Skill Error: ${error.message}`, error.originalError);
        } else if (error instanceof StateError) {
             console.error(`❌ State Error: ${error.message}`, error.originalError);
        } else if (error instanceof LgaError) {
             console.error(`❌ LGA Error: ${error.message}`, error.originalError);
        } else {
             console.error("❌ Unknown Seeding Error:", error);
        }
    }
};

// Execute the function
seedDatabase();
