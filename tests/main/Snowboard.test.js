import Snowboard from '../../src/main/Snowboard';

describe('Snowboard framework', () => {
    it('is frozen on construction and doesn\'t allow prototype pollution', () => {
        const snowboard = new Snowboard();

        expect(() => {
            snowboard.newMethod = () => true;
        }).toThrow(TypeError);
    });
});
