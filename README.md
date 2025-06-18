# Pokus Extension

## Setup Project

To set up the project using [Bun](https://bun.sh/), follow these steps:

1. **Install Bun**  
    If you don't have Bun installed, you can install it by running:
    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```

2. **Install Dependencies**  
    Navigate to the project directory and install the dependencies:
    ```bash
    bun install
    ```

3. **Available Scripts**  
    The following scripts are available in the `package.json` file:

    - **`build`**: Compiles the project using Vite with the configuration specific to Chrome.
    - **`build:chrome`**: An alias for the `build` script, tailored for Chrome.
    - **`build:firefox`**: Compiles the project using Vite with the configuration specific to Firefox.
    - **`dev`**: Launches the development server using `nodemon` with the Chrome-specific configuration.
    - **`dev:chrome`**: Launches the development server using `nodemon` with the Chrome-specific 
    - **`dev:firefox`**: Launches the development server using `nodemon` with the Firefox-specific configuration.
    - **`dev:newtab`**: Starts the development server for the new tab page using Vite. After starting, open your browser and navigate to the path `src/pages/newtab/`.
    - **`lint`**: Runs both Prettier and ESLint to format and lint the codebase.
    - **`check`**: Verifies code formatting and linting without making any changes.
    - **`eslint`**: Executes ESLint to lint the code and automatically fix issues.
    - **`eslint:check`**: Executes ESLint to check for linting issues without applying fixes.
    - **`prettier`**: Formats the codebase using Prettier.
    - **`prettier:check`**: Checks the code formatting using Prettier without applying changes.
    - **`postinstall`**: Automatically sets up Lefthook for managing Git hooks after dependencies are installed.

    You can use these scripts to build, develop, and maintain the project efficiently.

4. **Run a Script**  
    Use the following command to run any script:
    ```bash
    bun run <script-name>
    ```

    For example, to start the development server for Chrome:
    ```bash
    bun run dev:chrome
    ```

5. **Post-Installation**  
    After installing dependencies, Lefthook will be automatically set up to manage Git hooks.

That's it! You're ready to start working on the project.
