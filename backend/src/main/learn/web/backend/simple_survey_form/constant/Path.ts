import path from "path";

export interface PathType {
    DIR_PRIVATE_RESOURCE: string;
};

const PATH: Readonly<PathType> = Object.freeze({
    DIR_PRIVATE_RESOURCE: path.resolve(__dirname, "../../../../../resource"),
});

export default PATH;


