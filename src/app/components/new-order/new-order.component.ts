import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order, Product } from '../../models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.css'
})
export class NewOrderComponent implements  OnInit{

  constructor(private fb:FormBuilder,private orderService:OrderService){}


  formOrder!:FormGroup;

  listProducts:Product[]=[];

  ngOnInit(): void {

   this.formOrder=this.fb.group({
    customerName:['',[Validators.required,Validators.minLength(3)]],
    email:['',[Validators.required,Validators.email ]],
    products:this.fb.array([])
   })

   this.orderService.getProducts()
    .subscribe(arg => this.listProducts = arg);
    this.calculateTotalPrice();

  
  }

  get products():FormArray{
    return this.formOrder.get('products') as FormArray;
  }

  addProduct(){
    const  productForm=this.fb.group({
      product:['',Validators.required],
      price:[0,Validators.required],
      quantity:[1,[Validators.required,Validators.min(1),Validators.max(10)]],
      stock:[0,Validators.required]
    })

    productForm.valueChanges.subscribe(() => {
      this.calculateTotalPrice();  // Cada vez que cambie algún valor, recalcular el total
      // this.agregarListaProductoSeleccionados(productForm);
    });

    this.products.push(productForm);
    this.valueChanges(productForm);
   
  }
  
  // verificarSiExiste(productForm:FormGroup){
  //   this.products.controls.forEach(product => {
  //     if(product==productForm.product){
  //       this.formOrder.setErrors({ customError: 'El total supera el límite permitido.' });
  //     } else {
  //       this.formOrder.setErrors(null); // Elimina el error si ya no es válido
  //     }
  //  }); 

  // }

  // listSelectedProducts:{product:{product:string,price:number,quantity:number,stock:number;}}[]=[];
  // agregarListaProductoSeleccionados(product:any){
  //   this.listSelectedProducts.push(product);
  // }

  removeProduct(index:number){
    this.products.removeAt(index);
    this.calculateTotalPrice();
  }

  guardar() {
    // Genera un ID aleatorio para el pedido
    const idRandom = Math.floor(Math.random() * 1000) + 1;
  
    // Crea el objeto `newOrder` con todos los campos requeridos
    const newOrder: Order = {
      id: idRandom.toString(),
      customerName: this.formOrder.get('customerName')?.value || '',  // Valor por defecto en caso de `null`
      email: this.formOrder.get('email')?.value || '',                // Valor por defecto en caso de `null`
      products: this.formOrder.get('products')?.value.map((product: { id: string; quantity: number; stock: number; price: number; }) => ({
        productId: product.id,
        quantity: product.quantity,
        stock: product.stock,
        price: product.price
      })) || [], // Asegura un array vacío si `products` es `null` o `undefined`
      total: this.totalFinal,
      orderCode: this.generateOrderCode(
        this.formOrder.get('customerName')?.value,
        this.formOrder.get('email')?.value
      ),
      timestamp: new Date().toISOString()  // Formato de timestamp ISO
    };
  
    // Llama al servicio para guardar la orden
    this.orderService.postOrder(newOrder)
      .subscribe(
        () => {
          alert("Cargado correctamente");
        },
        error => {
          console.error("Error al cargar la orden:", error);
          alert("Ocurrió un error");
        }
      );
  }
  


   generateOrderCode(clientName: string, clientEmail: string): string {
    // Obtener la primera letra del nombre del cliente
    const firstLetter = clientName.charAt(0).toUpperCase(); 
  
    // Obtener los últimos 4 caracteres del email
    const emailSuffix = clientEmail.slice(-4); 
  
    // Obtener el timestamp actual y tomar solo los dos últimos dígitos
    const timestamp = Date.now().toString().slice(-2); 
  
    // Generar el código único concatenando los tres elementos
    const orderCode = `${firstLetter}${emailSuffix}${timestamp}`;
  
    return orderCode;
  }

 
  


  totalFinal:number=0;

  calculateTotalPrice(): number {
    let total = 0;
    // Recorremos todos los productos en el FormArray
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products.at(i);  // Obtener el FormGroup de cada producto
      const quantity = product.get('quantity')?.value;  // Obtener el valor de cantidad
      const price = product.get('price')?.value;  // Obtener el valor de precio
      
      total += quantity * price;  // Multiplicar cantidad por precio y agregar al total
    }
    
    return this.totalFinal=total;  // Retornar el total calculado
  }
  

  valueChanges(moduloGroup: FormGroup) {

    moduloGroup.get('product')?.valueChanges.subscribe((product: Product) => {
        if (product) {
            moduloGroup.get('stock')?.setValue(product.stock);
            const precio=moduloGroup.get('quantity')?.value * product.price;
            moduloGroup.get('price')?.setValue(precio);
            
          moduloGroup.get('quantity')?.valueChanges.subscribe(value=>{
            moduloGroup.get('price')?.setValue(value*product.price)
          })

        }
    });

}


}
