import React, { useState, useEffect } from 'react';
import './Maze.css'; // Import CSS file for styling

const Maze = () => {
    const [maze, setMaze] = useState({
        rows: 10,
        cols: 10,
        cells: [],
        ratPosition: { row: 0, col: 0 },
        destination: { row: 9, col: 9 },
        gameOver: false,
        win: false,
        moves: 0,
        time: 0,
    });

    // Function to generate the maze grid
    const generateMaze = () => {
        const rows = [];
        for (let i = 0; i < maze.rows; i++) {
            const row = [];
            for (let j = 0; j < maze.cols; j++) {
                // Generate walls and paths randomly (for demonstration)
                row.push(Math.random() < 0.3 ? 1 : 0);
            }
            rows.push(row);
        }
        // Set start and destination positions
        rows[0][0] = 0; // Start position
        rows[maze.destination.row][maze.destination.col] = 0; // Destination position
        setMaze(prevMaze => ({ ...prevMaze, cells: rows }));
    };

    // Effect to generate the maze grid on component mount
    useEffect(() => {
        generateMaze();
    }, []);

    // Function to handle keydown events for rat movement
    const handleKeyDown = (event) => {
        if (maze.gameOver || maze.win) return;
        const { key } = event;
        const { row, col } = maze.ratPosition;
        let newRow = row;
        let newCol = col;
        switch (key) {
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(maze.rows - 1, row + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(maze.cols - 1, col + 1);
                break;
            default:
                return;
        }
        if (maze.cells[newRow][newCol] === 0) {
            const newRatPosition = { row: newRow, col: newCol };
            const newMoves = maze.moves + 1;
            const isWin = newRow === maze.destination.row && newCol === maze.destination.col;
            setMaze(prevMaze => ({
                ...prevMaze,
                ratPosition: newRatPosition,
                moves: newMoves,
                win: isWin,
                gameOver: isWin ? false : prevMaze.gameOver
            }));
        } else {
            setMaze(prevMaze => ({ ...prevMaze, gameOver: true }));
        }
    };

    // Effect to add event listener for keydown events
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [maze]);

    // Function to reset the game
    const resetGame = () => {
        generateMaze();
        setMaze(prevMaze => ({
            ...prevMaze,
            ratPosition: { row: 0, col: 0 },
            gameOver: false,
            win: false,
            moves: 0,
            time: 0
        }));
    };

    // JSX to render the maze grid and game information
    return (
        <div>
            <div className="maze-container">
                {maze.cells.map((row, rowIndex) => (
                    <div key={rowIndex} className="maze-row">
                        {row.map((cell, colIndex) => (
                            <div key={colIndex} className={`maze-cell ${cell === 1 ? 'wall' : 'path'} ${maze.ratPosition.row === rowIndex && maze.ratPosition.col === colIndex ? 'rat' : ''} ${maze.destination.row === rowIndex && maze.destination.col === colIndex ? 'destination' : ''}`}></div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="info">
                <p>Moves: {maze.moves}</p>
                <p>Time: {maze.time} seconds</p>
                {maze.gameOver && <p className="game-over">Game Over!</p>}
                {maze.win && <p className="win">You Win!</p>}
                {(maze.gameOver || maze.win) && <button onClick={resetGame}>Play Again</button>}
            </div>
        </div>
    );
}

export default Maze;
