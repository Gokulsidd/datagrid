'use client';

import {
  AutoColumnSize,
  Autofill,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenRows,
  registerPlugin,
  ManualColumnResize,
  ManualColumnMove,
  ColumnSorting,
} from 'handsontable/plugins';

import {
  CheckboxCellType,
  NumericCellType,
  registerCellType,
} from 'handsontable/cellTypes';
import { HotTable, HotColumn } from '@handsontable/react';

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { Data } from '@/app/(dashboard)/data';


registerCellType(CheckboxCellType);
registerCellType(NumericCellType);

registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);
registerPlugin(ManualColumnResize);
registerPlugin(ManualColumnMove);
registerPlugin(ColumnSorting);

type GridProps = {
  data: Data;
};

export default function Grid(props: GridProps) {
  return (
    <div className="ht-theme-main z-0 p-4">
      <HotTable className='z-0 w-full border-none'
        data={props.data}
        stretchH="all"
        colHeaders={[
          'Company name',
          'Country',
          'Name',
          'Sell date',
          'Order ID',
          'In stock',
          'Qty',
          'Progress',
          'Rating',
        ]}
        manualColumnResize={true} // ✅ Enable column resizing
        autoColumnSize={true}
        columnSorting={true}
        manualColumnMove={true}
        dropdownMenu={{
          items: {
            // ✅ Filters
            filter_by_condition: {},
            filter_by_value: {},
            filter_action_bar: {},
          },
        }}
        contextMenu={true}
        filters={true}
        rowHeaders={true}
        manualRowMove={true}
        navigableHeaders={true}
        autoWrapRow={true}
        autoWrapCol={true}
        height={580}
        imeFastEdit={true}
        licenseKey="non-commercial-and-evaluation"
      >
        <HotColumn data={1} />
        <HotColumn data={2} />
        <HotColumn data={3} />
        <HotColumn data={5} />
        <HotColumn data={6} type="checkbox" className="htCenter" />
        <HotColumn data={7} type="numeric" />
        <HotColumn data={8} readOnly={true} className="htMiddle" />
        <HotColumn data={9} readOnly={true} className="htCenter" />
      </HotTable>
    </div>
  );
}
