

Fixes/reworks:

* en factory screen:
- cambiar el milestones por progress bar en cada item segun lo que pida
- deployMachines sdebe mostrar una version muy minima de las maquinas deployadas y si estan procesando o no

* ajustar en build screen cuando sale el toast de built machine, debe cerrar el previo y disparar un nuevo toast cada vez, en lugar de simplemente reemplazar el texto, debe dispararse un nuevo toast.


* en Deployed Machines:
Miner dice Idle (Not Placed) cuando sie sta funcionando. Ajustar UI
debe ponerse automaticamente en idle al llegar al resourcecap del recurso asignado
Smelter: agregar mini toast al completar craft

agregar INVENTARIO en screens de deployedMachines

Revisar cancel crafting/ pause crafting - arreglarlo y agregarlo a machineCard.

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


* en product assembly agregar buscador de recetas