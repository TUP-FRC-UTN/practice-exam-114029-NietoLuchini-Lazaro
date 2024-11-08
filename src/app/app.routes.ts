import { Routes } from '@angular/router';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';

export const routes: Routes = [
    {
        path:'listOrders',
        component:ListOrdersComponent
    },
    {
        path:'newOrder',
        component:NewOrderComponent
    }
];
