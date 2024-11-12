

export class CategoryDto{

    private constructor(
        public readonly name: string,
        public readonly user?: string,
        public readonly id?: string,
        public readonly available?: boolean,
    ){}


    static create(options: { [key: string]: any }) : [string?, CategoryDto?]{
        const {name, user, id, available = true} = options;

        let availableBoolean = available;

        if(!name) return ['Name is required'];

        if(typeof available !== 'boolean'){
            availableBoolean = (available === 'true');
        }

        return [undefined, new CategoryDto(name, user, id, availableBoolean)];
    }

    static update(options: { [key: string]: any }) : [string?, CategoryDto?]{
        const {name, user, id, available = true} = options;

        let availableBoolean = available;

        if(!name) return ['Name is required'];

        if(typeof available !== 'boolean'){
            availableBoolean = (available === 'true');
        }

        return [undefined, new CategoryDto(name, user, id, availableBoolean)];
    }

    static fromDatabase(options: { [key: string]: any }) : [string?, CategoryDto?]{
        const {name, user, id, available = true} = options;

        let availableBoolean = available;

        if(!id) return ['Id is required'];
        if(!user) return ['User is required'];
        if(!name) return ['Name is required'];

        if(typeof available !== 'boolean'){
            availableBoolean = (available === 'true');
        }

        return [undefined, new CategoryDto(name, user, id, availableBoolean)];
    }
}