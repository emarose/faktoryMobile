

Fixes/reworks:

* FACTORY SCREEN:
- cambiar el milestones por progress bar en cada item segun lo que pida
- deployMachines sdebe mostrar una version muy minima de las maquinas deployadas y si estan procesando o no

* BUILD SCREEN:
- ajustar en  cuando sale el toast de built machine, debe cerrar el previo y disparar un nuevo toast cada vez, en lugar de simplemente reemplazar el texto, debe dispararse un nuevo toast.
- no seleccionar una maquina por defecto
- deberia ser mas facil para el jugador ver al ingresar las recetas de las maquinas, talvez hacerlo con cards y que cada card muestre la receta. quiero simplificar la cantidad de pasos requeridos para construir la maquina.

* product assembly
- agregar buscador de recetas

* Deployed Machines:
- Miner dice Idle (Not Placed) cuando sie sta funcionando. Ajustar UI
- debe ponerse automaticamente en idle al llegar al resourcecap del recurso asignado
- agregar INVENTARIO en screens de deployedMachines

- Revisar cancel crafting/ pause crafting - arreglarlo y agregarlo a machineCard.

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

