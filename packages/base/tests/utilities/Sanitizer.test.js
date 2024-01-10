import TestInstance from '../../src/main/Snowboard';

describe('Sanitizer utility', () => {
    beforeEach(() => {
        document.currentScript.dataset.baseUrl = 'https://example.com';
        document.currentScript.dataset.assetUrl = 'https://example.com/fixtures/assets/';

        window.Snowboard = new TestInstance();
    });

    afterEach(() => {
        window.Snowboard.tearDown();
    });

    it('sanitizes some common XSS vectors', () => {
        const html = `<div onclick="javascript:alert(1)">
            <script src="/myscript.js"></script>
            <script>
                document.body.innerHTML = 'Hacked!';
            </script>
            <p>We're cool. <iframe src="blah.html">But we're not.</iframe></p>
            <a href="javascript:alert(2)"></a>
            <img src="myimage.png" onload="javascript:alert(3)">
        </div>`;

        const output = Snowboard.sanitizer().sanitize(html).replace(/\s+/g, ' ');

        expect(output).toEqual('<div> <p>We\'re cool. </p> <a></a> <img src="myimage.png"> </div>');
    });

    it('can return the full html', () => {
        const html = `<html>
            <head>
                <title>Hi</title>
                <script src="/myscript.js"></script>
            </head>
            <body>
                <div onclick="javascript:alert(1)">
                    <script src="/myscript.js"></script>
                    <script>
                        document.body.innerHTML = 'Hacked!';
                    </script>
                    <p>We're cool. <iframe src="blah.html">But we're not.</iframe></p>
                    <a href="javascript:alert(2)"></a>
                    <img src="myimage.png" onload="javascript:alert(3)">
                </div>
            </body>
        </html>`;

        const output = Snowboard.sanitizer().sanitize(html, false).replace(/\s+/g, ' ');

        expect(output).toEqual('<html><head> <title>Hi</title> </head> <body> <div> <p>We\'re cool. </p> <a></a> <img src="myimage.png"> </div> </body></html>');
    });
});
