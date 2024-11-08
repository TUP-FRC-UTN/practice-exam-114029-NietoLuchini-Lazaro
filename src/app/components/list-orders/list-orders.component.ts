import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-list-orders',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.css'
})
export class ListOrdersComponent implements OnInit {

  constructor(private orderService:OrderService){}

  listOrders:Order[]=[];
  filteredOrders: Order[] = []; // Array para almacenar las órdenes filtradas
  searchQuery: string = ''; // Valor del input de búsqueda

  ngOnInit(): void {
    this.orderService.getOrders()
      .subscribe((orders) => {
        this.listOrders = orders;
        this.filteredOrders = orders; // Inicializar la lista filtrada con todas las órdenes
      });
    
  }

  onSearch(): void {
    // Filtrar las órdenes según el nombre o el email
    if (this.searchQuery) {
      this.filteredOrders = this.listOrders.filter(order =>
        order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredOrders = this.listOrders; // Si el input está vacío, mostrar todas las órdenes
    }
  }

}
