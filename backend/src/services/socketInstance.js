let ioInstance;

export const setIo = (instance) => {
    ioInstance = instance;
};

export const getIo = () => {
    return ioInstance;
};
