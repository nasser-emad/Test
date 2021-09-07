import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';


@Component({
    selector: 'demo-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    dataSource: any;
    connectionStarted: boolean;

    constructor() {
        this.connectionStarted = false;

        var hubConnection = new HubConnectionBuilder()
            .withUrl("https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub", {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

        var store = new CustomStore({
            load: () => hubConnection.invoke("getAllStocks"),
            key: "symbol"
        });

        hubConnection
            .start()
            .then(() => {
                hubConnection.on("updateStockPrice", (data: any) => {
                    store.push([{ type: "update", key: data.symbol, data: data }]);
                });
                this.dataSource = store;
                this.connectionStarted = true;
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
