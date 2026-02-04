import { Routes } from '@angular/router';
import { XlsxReader } from './components/xlsx-reader/xlsx-reader';
import { XlsxSheetChooser } from './components/xlsx-sheet-chooser/xlsx-sheet-chooser';
import { XlsxSheetInfos } from './components/xlsx-sheet-infos/xlsx-sheet-infos';
import { StudySpace } from './components/study-space/study-space';

export const routes: Routes = [
    { path: '', redirectTo: 'file-selector', pathMatch: 'full' },
    { path: 'file-selector', component: XlsxReader },
    { path: 'sheet-chooser', component: XlsxSheetChooser },
    { path: 'sheet-infos', component: XlsxSheetInfos },
    { path: 'study-space', component: StudySpace }
];
