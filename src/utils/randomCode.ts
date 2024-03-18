export const gerarChaveAleatoria = () => {
    return Math.random().toString(36).substring(2, 10);
};