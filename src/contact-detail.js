import {inject} from 'aurelia-framework';
    import {EventAggregator} from 'aurelia-event-aggregator';
    import {WebAPI} from './web-api';
    import {ContactUpdated,ContactViewed} from './messages';
    import {areEqual} from './utility';
    import {HttpClient} from 'aurelia-http-client';

    @inject(WebAPI, EventAggregator)
    export class ContactDetail {
      constructor(api, ea){
        this.api = api;
        this.ea = ea;
      }

      activate(params, routeConfig) {
        this.routeConfig = routeConfig;

        return this.api.getContactDetails(params.id).then(contact => {
          this.contact = contact;
          this.routeConfig.navModel.setTitle(contact.firstName);
          this.originalContact = JSON.parse(JSON.stringify(contact));
          this.ea.publish(new ContactViewed(this.contact));

        });
      }

      get canSave() {
        return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
      }

      save() {
        //comunicacion con server
        let client = new HttpClient()
        .configure(x => {
          x.withBaseUrl('http://localhost:8090/');
          x.withHeader('Authorization', 'bearer 123');
          x.withParams({ abc: this.contact });
        });

        client.get('/aurelia')
        .then(data => {
          console.log('click a save luego de hacer el cliente: '+data.response)
          this.contact.mensaje=data.response
        });



        this.api.saveContact(this.contact).then(contact => {
          this.contact = contact;
          this.routeConfig.navModel.setTitle(contact.firstName);
          this.originalContact = JSON.parse(JSON.stringify(contact));
          this.ea.publish(new ContactUpdated(this.contact));
        });
      }

      canDeactivate() {
        if(!areEqual(this.originalContact, this.contact)){
          let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

          if(!result) {
            this.ea.publish(new ContactViewed(this.contact));
          }

          return result;
        }

        return true;
      }
    }
