import { createId } from "@paralleldrive/cuid2";

const isEntity = <T>(v: Entity<T>): v is Entity<T> => {
    return v instanceof Entity;
};
3
export abstract class Entity<T> {
    protected readonly _id: string;
    protected props: T;

    constructor(props: T, id?: string) {
        this._id = id ? id : createId();
        this.props = props;
    }

    public equals(object?: Entity<T>): boolean {
        if (object == null || object == undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }
        return this._id == object._id;
    }
}

