import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { PeriodicElement } from "../models/element.model";
import { ElementsState } from "../models/elements-state.model";

const ELEMENT_DATA: ElementsState = {
    elements: [
        { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
        { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
        { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
        { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
        { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
        { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
        { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    ]
};

export const ElementsStore = signalStore(withState(ELEMENT_DATA), withMethods((store) => ({
    updateElement: (column: string, element: PeriodicElement, newValue: string | number) => {
        const updatedElements = store.elements().map((el) =>
            el.position === element.position ? { ...el, [column]: newValue } : el
        );
        patchState(store, { elements: updatedElements });
    }
})));