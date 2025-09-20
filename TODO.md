Fixes/reworks:
- TODAS las screens deben llevar un componente dynamico reutilizable que tendrá una flecha hacia atras, un titulo y opcional icono presionable a la derecha. Este header reemplazará el header del stack navigator y su goBack. El objetivo es obtener una mayor personalizacion sobre el header.

* FACTORY SCREEN:
- deployMachines no muestra correctamente las maquinas, siempre muestra "no machines deployed yet" y 0 total. debe reflejar las maquinas y el estado de cada una. Revisar el estilado.

* MACHINE BUILDER SCREEN:
- Muestra las maquinas en un orden fijo: Miner, Smelter, Constructor, Assembler, y luego proseguir con el orden natural segun el milestone que permita su construccin

* product assembly screen
- cambia el estilo del buscador a estar siempre visible (sin necesidad de presionar la lupa) en la parte superior con bordes redondeados.
- revisar la funcionalidad y el display de numero de recetas encontradas
- la card de "miner" se encuentra fija, cuando deberia mostrarse por defecto seleccionada la primer maquina en que se encuentren resultados. por ejemplo: buscar "Rotor" debe mostrar seleccionado el chip del Assembler y alli sus recetas. EN caso haya varias maquinas mostrará la primera y el usuario podrá cambiar entre las distintas maquinas que contengan resultados.


* Deployed Machines screen:
- MINER: 
- cambiar los tipos de maquinas a filtros o tabs, el scroll vertical es muy largo cuandos e agregan muchas maquinas, la pantalla debe poder filtrarse mejor entre tipos de maquina.
- Revisar cancel crafting/ pause crafting - arreglarlo y agregarlo a machineCard.


// CAMBIOS A POSTERIORI

* Cambiar recetas de maquinas:
 - smelter
 - foundry
 - refinery
 - Assembler
 - Manufacturer
 - Constructor

* Acomodar requisitos de milestones.

Implementaciones:

* Agregar un tutorial/onboarding:
- navega a la posicion x,y (encuentra nodo)
- explora el mapa ...

