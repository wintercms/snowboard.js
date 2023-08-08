import TestInstance from '../../src/main/Snowboard';

describe('JsonParser utility', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/fixtures/assets/';

        window.Snowboard = new TestInstance();
    });

    it('parses a null or undefined', () => {
        expect(Snowboard.jsonParser().parse('null')).toEqual(null);
        expect(Snowboard.jsonParser().parse('undefined')).toBeUndefined();
    });

    it('parses booleans', () => {
        expect(Snowboard.jsonParser().parse('true')).toEqual(true);
        expect(Snowboard.jsonParser().parse('false')).toEqual(false);
    });

    it('parses numbers', () => {
        expect(Snowboard.jsonParser().parse('7')).toEqual(7);
        expect(Snowboard.jsonParser().parse('5.82341')).toEqual(5.82341);
        expect(Snowboard.jsonParser().parse('-3')).toEqual(-3);
        expect(Snowboard.jsonParser().parse('+1.987')).toEqual(1.987);
        expect(Snowboard.jsonParser().parse('.8675309')).toEqual(0.8675309);
    });

    it('parses a simple string', () => {
        expect(Snowboard.jsonParser().parse('test')).toEqual('test');
        expect(Snowboard.jsonParser().parse('"test"')).toEqual('test');
        expect(Snowboard.jsonParser().parse('"null"')).toEqual('null');
        expect(Snowboard.jsonParser().parse('\'1.23\'')).toEqual('1.23');
        expect(Snowboard.jsonParser().parse('\'test\'')).toEqual('test');
        expect(Snowboard.jsonParser().parse('1.2.3')).toEqual('1.2.3');
    });

    it('parses a string that looks like an object', () => {
        expect(Snowboard.jsonParser().parse('first: second')).toEqual({
            first: 'second',
        });
        expect(Snowboard.jsonParser().parse('firstName: "Ben", surname: \'Thomson\'')).toEqual({
            firstName: 'Ben',
            surname: 'Thomson',
        });
    });

    it('parses an actual object', () => {
        expect(Snowboard.jsonParser().parse('{ first: second }')).toEqual({
            first: 'second',
        });
        expect(Snowboard.jsonParser().parse('{ \'firstName\': "Ben", "surname": \'Thomson\' }')).toEqual({
            firstName: 'Ben',
            surname: 'Thomson',
        });
    });

    it('parses a string that looks like an array', () => {
        expect(Snowboard.jsonParser().parse('winter, is, cool')).toEqual([
            'winter',
            'is',
            'cool',
        ]);
        expect(Snowboard.jsonParser().parse('\'winter\', \'is\', \'number\', 1')).toEqual([
            'winter',
            'is',
            'number',
            1,
        ]);
    });

    it('can parse a complex object with multiple layers', () => {
        expect(Snowboard.jsonParser().parse('celebs: { tom: { holland: true, "cruise": false, "others": [ hardy, "hanks" ] } }, movies: [ { movie: "The Avengers" , stars : 4 }, { movie: "Mission: Impossible", stars: 4 } ]')).toEqual({
            celebs: {
                tom: {
                    holland: true,
                    cruise: false,
                    others: [
                        'hardy',
                        'hanks',
                    ],
                },
            },
            movies: [
                {
                    movie: 'The Avengers',
                    stars: 4,
                },
                {
                    movie: 'Mission: Impossible',
                    stars: 4,
                },
            ],
        });
    });

    it('can parse an object over multiple lines', () => {
        expect(Snowboard.jsonParser().parse(`celebs: {
             tom:
                { holland: true, "cruise": false,
                "others": [ hardy, "hanks" ] }
            }
            , movies: [
                { movie: "The Avengers" , stars : 4 },
                { movie:
                    "Mission:
                    Impossible",
                stars:
                 4 }
            ]`)).toEqual({
            celebs: {
                tom: {
                    holland: true,
                    cruise: false,
                    others: [
                        'hardy',
                        'hanks',
                    ],
                },
            },
            movies: [
                {
                    movie: 'The Avengers',
                    stars: 4,
                },
                {
                    movie: 'Mission:\n                    Impossible',
                    stars: 4,
                },
            ],
        });
    });
});
