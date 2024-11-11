

export class CategoryDto{

    private constructor(
        public readonly name: string,
        public readonly available?: boolean
    ){}


    static create(options: { [key: string]: any }) : [string?, CategoryDto?]{
        const {name, available = true} = options;

        let availableBoolean = available;

        if(!name) return ['Name is required'];
        if(typeof available !== 'boolean'){
            availableBoolean = (available === 'true');
        }


        return [undefined, new CategoryDto(name, availableBoolean)];
    }
}