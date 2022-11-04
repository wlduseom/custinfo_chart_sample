sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "sync/sap/custinfo/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("sync.sap.custinfo.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                var oData2 = {

                    "genders" : [
                        {
                            "gender" : 'F', "plantS" : null, "plantJ" : null, "book" : null, "request" : null
                        },
                        {
                            "gender" : 'M', "plantS" : null, "plantJ" : null, "book" : null, "request" : null
                        },
                    ]
                    

                };

                var oModel = new JSONModel();
                var oModel2 = new JSONModel(oData2);

                this.setModel(oModel, "Compo");
                this.setModel(oModel2, "Gender");

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);