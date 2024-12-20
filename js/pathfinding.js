// DOM Elements
const gridContainer = document.getElementById("gridContainer");
const algorithmSelector = document.getElementById("algorithmSelector");
const startVisualization = document.getElementById("startVisualization");
const clearGrid = document.getElementById("clearGrid");
const randomWallsButton = document.getElementById("randomWalls");
const buildMazeButton = document.getElementById("buildMaze");
const feedback = document.getElementById("feedback");

// Constants
const ROWS = 20; // Adjustable grid dimensions
const COLS = 20;
let grid = [];
let startNode = null;
let endNode = null;
let nodesVisited = 0;
let pathLength = 0;
let startTime = 0;

// Initialize Grid
function initializeGrid() {
    gridContainer.innerHTML = ""; // Clear existing grid
    grid = [];

    for (let row = 0; row < ROWS; row++) {
        const gridRow = [];
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener("click", () => handleCellClick(cell));
            gridRow.push({ row, col, isWall: false });
            gridContainer.appendChild(cell);
        }
        grid.push(gridRow);
    }
}

// Handle Cell Click
function handleCellClick(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (!startNode) {
        startNode = { row, col };
        cell.classList.add("start");
    } else if (!endNode) {
        endNode = { row, col };
        cell.classList.add("end");
    } else {
        const node = grid[row][col];
        node.isWall = !node.isWall;
        cell.classList.toggle("wall");
    }
}

// Clear Grid
function clearGridHandler() {
    startNode = null;
    endNode = null;
    initializeGrid();
    feedback.textContent = "";
}

// Generate Random Walls
function generateRandomWalls() {
    clearGridHandler();

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (Math.random() < 0.3) { // 30% chance to place a wall
                const node = grid[row][col];
                node.isWall = true;
                const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add("wall");
            }
        }
    }
}

// Build Maze (Recursive Division)
function buildMazeHandler() {
    // Clear the grid first
    clearGridHandler();

    // Create a 2D array to track visited cells during maze generation
    const visited = Array.from({ length: ROWS }, () => 
        Array(COLS).fill(false)
    );

    // Function to get unvisited neighbors
    function getUnvisitedNeighbors(row, col) {
        const neighbors = [
            { row: row - 2, col },
            { row: row + 2, col },
            { row, col: col - 2 },
            { row, col: col + 2 }
        ];

        return neighbors.filter(n => 
            n.row >= 0 && n.row < ROWS && 
            n.col >= 0 && n.col < COLS && 
            !visited[n.row][n.col]
        );
    }

    // Function to remove wall between two cells
    function removeWall(cell1, cell2) {
        const midRow = Math.floor((cell1.row + cell2.row) / 2);
        const midCol = Math.floor((cell1.col + cell2.col) / 2);
        
        const node = grid[midRow][midCol];
        const cell = document.querySelector(`.grid-cell[data-row="${midRow}"][data-col="${midCol}"]`);
        
        node.isWall = false;
        cell.classList.remove("wall");
    }

    // Initial state: fill with walls
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const node = grid[row][col];
            const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
            
            node.isWall = true;
            cell.classList.add("wall");
        }
    }

    // Recursive backtracking maze generation
    function generateMaze(row, col) {
        visited[row][col] = true;
        const node = grid[row][col];
        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        
        node.isWall = false;
        cell.classList.remove("wall");

        // Shuffle neighbors to randomize maze
        const neighbors = getUnvisitedNeighbors(row, col)
            .sort(() => Math.random() - 0.5);

        for (const neighbor of neighbors) {
            if (!visited[neighbor.row][neighbor.col]) {
                removeWall({ row, col }, neighbor);
                generateMaze(neighbor.row, neighbor.col);
            }
        }
    }

    // Start maze generation from a random point
    const startRow = 1;
    const startCol = 1;
    generateMaze(startRow, startCol);

    // Ensure start and end nodes are clear
    if (!startNode) {
        startNode = { row: 1, col: 1 };
        const startCell = document.querySelector(`.grid-cell[data-row="1"][data-col="1"]`);
        startCell.classList.add("start");
        grid[1][1].isWall = false;
    }

    if (!endNode) {
        endNode = { row: ROWS - 2, col: COLS - 2 };
        const endCell = document.querySelector(`.grid-cell[data-row="${ROWS-2}"][data-col="${COLS-2}"]`);
        endCell.classList.add("end");
        grid[ROWS-2][COLS-2].isWall = false;
    }

    // Ensure start and end cells are not walls
    const startCell = document.querySelector(`.grid-cell[data-row="${startNode.row}"][data-col="${startNode.col}"]`);
    const endCell = document.querySelector(`.grid-cell[data-row="${endNode.row}"][data-col="${endNode.col}"]`);
    
    grid[startNode.row][startNode.col].isWall = false;
    grid[endNode.row][endNode.col].isWall = false;
    
    startCell.classList.remove("wall");
    endCell.classList.remove("wall");
}

// Function to update statistics
function updateStats(visitedCount, pathLen, timeElapsed) {
    document.getElementById('nodesVisited').textContent = visitedCount;
    document.getElementById('pathLength').textContent = pathLen;
    document.getElementById('timeTaken').textContent = `${timeElapsed}ms`;
}


// Breadth-First Search (BFS) Algorithm
async function bfs(grid, startNode, endNode) {
    const queue = [startNode];
    const visited = new Set();
    const parent = {};

    visited.add(`${startNode.row}-${startNode.col}`);

    while (queue.length > 0) {
        const current = queue.shift();
        const { row, col } = current;

        // Check if we've reached the end node
        if (row === endNode.row && col === endNode.col) {
            const path = [];
            let key = `${row}-${col}`;
            while (key) {
                const [r, c] = key.split("-").map(Number);
                path.unshift({ row: r, col: c });
                key = parent[key];
            }
            return path;
        }

        // Explore neighbors (Up, Down, Left, Right)
        for (const [dr, dc] of [
            [-1, 0], // Up
            [1, 0],  // Down
            [0, -1], // Left
            [0, 1],  // Right
        ]) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS &&
                !visited.has(`${newRow}-${newCol}`) &&
                !grid[newRow][newCol].isWall
            ) {
                queue.push({ row: newRow, col: newCol });
                visited.add(`${newRow}-${newCol}`);
                parent[`${newRow}-${newCol}`] = `${row}-${col}`;

                // Visualize visited cell
                const cell = document.querySelector(`.grid-cell[data-row="${newRow}"][data-col="${newCol}"]`);
                cell.classList.add("visited");
                nodesVisited++;
                await new Promise((resolve) => setTimeout(resolve, 50)); // Animation delay
            }
        }
    }

    return null; // No path found
}

// Dijkstra Algorithm
async function dijkstra(grid, start, end) {
    const visited = new Set();
    const distances = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(Infinity)
    );
    const previous = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(null)
    );
    distances[start.row][start.col] = 0;

    const priorityQueue = [{ ...start, distance: 0 }];
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
    ];

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const current = priorityQueue.shift();
        const { row, col, distance } = current;

        if (visited.has(`${row},${col}`)) continue;
        visited.add(`${row},${col}`);

        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add("visited");
        nodesVisited++;
        await new Promise((resolve) => setTimeout(resolve, 20));

        if (row === end.row && col === end.col) {
            // Reconstruct path
            const path = [];
            let current = { row, col };
            while (current) {
                path.unshift({ row: current.row, col: current.col });
                current = previous[current.row][current.col];
            }
            return path;
        }

        for (const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;

            if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS &&
                !grid[newRow][newCol].isWall &&
                !visited.has(`${newRow},${newCol}`)
            ) {
                const newDistance = distance + 1;
                if (newDistance < distances[newRow][newCol]) {
                    distances[newRow][newCol] = newDistance;
                    previous[newRow][newCol] = { row, col };
                    priorityQueue.push({ row: newRow, col: newCol, distance: newDistance });
                }
            }
        }
    }

    return null;
}

// A* Algorithm
async function aStar(grid, start, end) {
    const openSet = [];
    const closedSet = new Set();
    const gScores = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(Infinity)
    );
    const previous = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(null)
    );
    gScores[start.row][start.col] = 0;

    const fScores = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(Infinity)
    );
    fScores[start.row][start.col] = heuristic(start, end);

    openSet.push({ ...start, fScore: fScores[start.row][start.col] });

    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
    ];

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.fScore - b.fScore);
        const current = openSet.shift();
        const { row, col } = current;

        if (closedSet.has(`${row},${col}`)) continue;
        closedSet.add(`${row},${col}`);

        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add("visited");
        nodesVisited++;
        await new Promise((resolve) => setTimeout(resolve, 20));

        if (row === end.row && col === end.col) {
            // Reconstruct path
            const path = [];
            let current = { row, col };
            while (current) {
                path.unshift({ row: current.row, col: current.col });
                current = previous[current.row][current.col];
            }
            return path;
        }

        for (const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;

            if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS &&
                !grid[newRow][newCol].isWall &&
                !closedSet.has(`${newRow},${newCol}`)
            ) {
                const tentativeGScore = gScores[row][col] + 1;
                if (tentativeGScore < gScores[newRow][newCol]) {
                    gScores[newRow][newCol] = tentativeGScore;
                    fScores[newRow][newCol] = tentativeGScore + heuristic({ row: newRow, col: newCol }, end);
                    previous[newRow][newCol] = { row, col };

                    openSet.push({ row: newRow, col: newCol, fScore: fScores[newRow][newCol] });
                }
            }
        }
    }

    return null;
}
// Heuristic Function for A*
function heuristic(node, endNode) {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

// Reconstruct Path
function reconstructPath(current) {
    const path = [];
    while (current) {
        path.unshift({ row: current.row, col: current.col });
        current = current.parent;
    }
    return path;
}

// Visualize Path
function visualizePath(path) {
    // Clear previous path visualizations
    const allCells = document.querySelectorAll('.grid-cell');
    allCells.forEach(cell => cell.classList.remove("path"));

    // Add "path" class to cells in the shortest path
    for (const { row, col } of path) {
        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add("path");
    }
}

// Visualize Pathfinding
async function visualizePathfinding() {
    if (!startNode || !endNode) {
        feedback.textContent = "Please select a start and end node!";
        return;
    }

    // Reset statistics
    nodesVisited = 0;
    pathLength = 0;
    startTime = performance.now();

    const algorithm = algorithmSelector.value;
    let path;

    switch (algorithm) {
        case "dijkstra":
            feedback.textContent = "Running Dijkstra's Algorithm...";
            path = await dijkstra(grid, startNode, endNode);
            break;
        case "aStar":
            feedback.textContent = "Running A* Algorithm...";
            path = await aStar(grid, startNode, endNode);
            break;
        case "bfs":
            feedback.textContent = "Running Breadth-First Search...";
            path = await bfs(grid, startNode, endNode);
            break;
        default:
            feedback.textContent = "Invalid algorithm selected!";
            return;
    }

    const endTime = performance.now();
    const timeElapsed = Math.round(endTime - startTime);

    if (path) {
        visualizePath(path);
        pathLength = path.length;
        feedback.textContent = "Pathfinding Complete!";
    } else {
        feedback.textContent = "No path found!";
        pathLength = 0;
    }

    updateStats(nodesVisited, pathLength - 1, timeElapsed); // -1 because we don't count the start node
}

// Event Listeners
startVisualization.addEventListener("click", visualizePathfinding);
clearGrid.addEventListener("click", clearGridHandler);
randomWallsButton.addEventListener("click", generateRandomWalls);
buildMazeButton.addEventListener("click", buildMazeHandler);

// Initialize grid
initializeGrid();
