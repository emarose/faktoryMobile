En este juego, la progresión es el motor principal. Empiezas como un explorador en un vasto mundo cuadriculado, moviéndote libremente para descubrir los valiosos Nodos de Recursos. Cada nodo, identificado por un color único, contiene un mineral que puedes extraer manualmente al principio.

Tu primera gran meta será descubrir y minar suficientes recursos para desbloquear la pantalla de 'Constructor de Máquinas'. Aquí es donde el juego realmente evoluciona. Podrás construir Miners, tus primeros pasos hacia la automatización. Colocar un Miner en un nodo transformará la extracción manual en una producción pasiva, permitiéndote generar recursos sin esfuerzo.

Pero la automatización no es ilimitada. Los nodos tienen una capacidad finita, agotándose con el tiempo. Esto te obliga a tomar decisiones estratégicas: ¿exploras para encontrar nuevos nodos, o inviertes en mejorar la eficiencia de tus máquinas existentes para maximizar la producción de los recursos que ya tienes? Este ciclo de exploración, automatización y optimización es el corazón del juego

## Project Structure

- `/src/screens`: Main screens for gameplay and UI.
- `/src/components`: Reusable UI components.
- `/src/hooks`: Custom React hooks for game logic.
- `/src/data`: Static data for nodes, items, milestones, etc.
- `/src/contexts`: Global state management.

## Features

- Grid-based world exploration
- Manual and automated mining
- Machine building and upgrades
- Inventory management
- Milestone progression

## Controls

- Move with arrow buttons on the map screen.
- Tap nodes to mine or place machines.

The screens the player will be interacting with are:
[FACTORY] - This is the player "home", where he can see a clear state of machines built, inventory and items beign produced. No real interaction can be made here but its where the player will be navigating to and from to connect to other sections
