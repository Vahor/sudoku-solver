// Function that take a promise, and kills it if it takes too long
export const maxDelay = async <T>(promise: Promise<T>, maxDelay: number, onTimeout?: () => void) => {
    const timeout = setTimeout(() => {
        if (onTimeout) {
            onTimeout();
            return;
        }
        throw new Error("Promise timed out");
    }, maxDelay);

    try {
        return await promise;
    } finally {
        clearTimeout(timeout);
    }
}