export class CatError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
        this.name = "CatError";
    }
}
export class SkillError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
        this.name = "SkillError";
    }
}
export class StateError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
        this.name = "StateError";
    }
}
export class LgaError extends Error {
    constructor(message: string, public originalError: any) {
        super(message);
        this.name = "LgaError";
    }
}
