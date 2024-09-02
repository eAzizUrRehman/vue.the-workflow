export const GAP_BETWEEN_NODES_IN_X = 120
export const GAP_BETWEEN_NODES_IN_Y = 100
export const WORKFLOW_NODE_DIMENSIONS = {
    width: 350, height: 70,
}

export const ADDING_NODE_DIMENSIONS = {
    width: 120, height: 40,
}

export const INITIAL_NODES = [
    {
        id: "+eO'd18=}J",
        data: {
            ...WORKFLOW_NODE_DIMENSIONS,
            label: "+eO'd18=}J",
            type: 'workflow',
            parent: null,
            draggable: false,
            x: 0,
            y: 0,
            style:{

            }
        }
    },
     {
         id: "Xu]O+A'~69",
         data: {
             ...ADDING_NODE_DIMENSIONS,
             label: "2",
             type: 'adding',
             parent: "+eO'd18=}J",
             order: 1,
             draggable: false
         }
     },
     {
         id: "f%31jqVTaw",
         data: {
             ...ADDING_NODE_DIMENSIONS,
             label: "3",
             type: 'adding',
             parent: "+eO'd18=}J",
             order: 2,
             draggable: false
         }
     },
     {
         id: "bjuP}*o^6z",
         data: {
             ...ADDING_NODE_DIMENSIONS,
             label: "4",
             type: 'adding',
             parent: "+eO'd18=}J",
             order: 3,
             draggable: false
         }
     },
]