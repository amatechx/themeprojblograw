/*
 * Animated Grid Background - Magic UI Style Implementation
 * Heather Free Version Theme
 */

// Animated Grid Background - Magic UI Style Implementation
(function() {
    'use strict';

    // Configuration - matching Magic UI defaults
    var config = {
        width: 40,
        height: 40,
        x: -1,
        y: -1,
        numSquares: 50,
        maxOpacity: 0.5,
        duration: 4
    };

    var container = document.querySelector('.animated-grid-background');
    var squaresContainer = document.querySelector('.animated-grid-squares');

    if (!container || !squaresContainer) return;

    var dimensions = { width: 0, height: 0 };
    var squares = [];
    var resizeObserver = null;

    // Generate random position
    function getPos() {
        return [
            Math.floor((Math.random() * dimensions.width) / config.width),
            Math.floor((Math.random() * dimensions.height) / config.height)
        ];
    }

    // Generate squares array
    function generateSquares(count) {
        return Array.from({ length: count }, function(_, i) {
            return {
                id: i,
                pos: getPos()
            };
        });
    }

    // Update square position
    function updateSquarePosition(id) {
        var squareIndex = squares.findIndex(function(sq) { return sq.id === id; });
        if (squareIndex !== -1) {
            squares[squareIndex].pos = getPos();
            renderSquare(squares[squareIndex]);
        }
    }

    // Render a single square
    function renderSquare(square) {
        var squareElement = document.getElementById('animated-grid-square-' + square.id);
        if (squareElement) {
            var x = square.pos[0] * config.width + 1;
            var y = square.pos[1] * config.height + 1;
            squareElement.setAttribute('x', x);
            squareElement.setAttribute('y', y);
        }
    }

    // Render all squares
    function renderSquares() {
        squaresContainer.innerHTML = '';

        squares.forEach(function(square, index) {
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('id', 'animated-grid-square-' + square.id);
            rect.setAttribute('class', 'animated-grid-square');
            rect.setAttribute('width', config.width - 1);
            rect.setAttribute('height', config.height - 1);
            rect.setAttribute('x', square.pos[0] * config.width + 1);
            rect.setAttribute('y', square.pos[1] * config.height + 1);
            rect.setAttribute('fill', 'currentColor');
            rect.setAttribute('stroke-width', '0');

            // Add animation delay based on index
            rect.style.animationDelay = (index * 0.1) + 's';

            // Add animation complete handler
            rect.addEventListener('animationiteration', function() {
                updateSquarePosition(square.id);
            });

            squaresContainer.appendChild(rect);
        });
    }

    // Initialize squares
    function initSquares() {
        if (dimensions.width && dimensions.height) {
            squares = generateSquares(config.numSquares);
            renderSquares();
        }
    }

    // Setup ResizeObserver
    function setupResizeObserver() {
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(function(entries) {
                entries.forEach(function(entry) {
                    dimensions.width = entry.contentRect.width;
                    dimensions.height = entry.contentRect.height;
                    initSquares();
                });
            });

            resizeObserver.observe(container);
        } else {
            // Fallback for browsers without ResizeObserver
            function updateDimensions() {
                dimensions.width = container.offsetWidth;
                dimensions.height = container.offsetHeight;
                initSquares();
            }

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
        }
    }

    // Initialize
    function init() {
        setupResizeObserver();
        initSquares();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();