sap.ui.define([
	"sync/sap/custinfo/controller/BaseController",
	"sap/ui/Device",
	"sap/ui/core/mvc/View"
], function(BaseController, Device, View) {
	"use strict";

	var lastMeasure = ""; // to keep at least one measure for the url

	return BaseController.extend("sync.sap.custinfo.controller.Master", {

		onChartTypeChanged: function() {
			//just tell the detail to call
			var par = "";
			var measure = "";

			//way 1: by route
			var arr = this.byId('MeasureList').getSelectedItems();
			var itemPros = [];
			for (var i = arr.length - 1; i >= 0; i--) {
				itemPros[i] = arr[i].mProperties.title;
				measure = measure + itemPros[i];
			}
			if (measure) {
				lastMeasure = measure;
			}
			if (!measure) {
				measure = lastMeasure;
			}
			par = "chartType=" + this.byId("select").getSelectedKey() + "&" + 
				"color=" + this.byId("selectColor").getSelectedKey() + "&" +
				"tooltip=" + this.byId('selectPopover').getSelectedKey() + "&" +
				"measureNames=" + measure;
			this.getRouter().navTo("idoVizFrame2", {
				'chartIndex': par
			}, false);
		},

		onInit: function() {
			if (Device.system.phone) {
				return;
			}
			this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			var oComponentModel = this.getOwnerComponent().getModel('Compo');
			
			oModel.read("/CustBookSet", {
				// filters : [],
				success : function(oData) {
					console.log("Success");
					var aResult = oData.results;
					oComponentModel.setData(aResult);

					this._setCustBookData();
				}.bind(this),
				error : function () {
					console.log("Error")
				}
			});



			var urlInfo = this.parseURL(oEvent);
			this.byId("select").setSelectedKey(urlInfo.chartIndex.value);
			this.byId("selectColor").setSelectedKey(urlInfo.colorIndex.value);
			this.byId("selectPopover").setSelectedKey(urlInfo.popoverIndex.value);
			var hasValidURL = false;
			for (var elem in urlInfo) {
				if (urlInfo[elem].hasOwnProperty('value')) {
					hasValidURL = true;
				}
			}
			if (hasValidURL) {
				var parameters = urlInfo.measureIndex.value;
				var measures = [];
				var startIdx = 0;
				parameters.split('').forEach(function(elem, idx) {
					if (elem.toLowerCase() !== elem && idx !== startIdx) {
						measures.push(parameters.substring(startIdx, idx));
						startIdx = idx;
					}
					if (idx === parameters.length - 1) {
						measures.push(parameters.substring(startIdx, parameters.length));
					}
				});
				this.byId("PlantSeoul").setSelected(false);
				this.byId("PlantJeju").setSelected(false);
				this.byId("Book").setSelected(false);
				this.byId("Request").setSelected(false);
				for (var i = 0; i < measures.length; ++i) {
					this.byId(measures[i]).setSelected(true);
				}
			}
			//Load the detail view in desktop
			var myRouter = this.getRouter();
			var oOptions = {
				currentView: this.getView(),
				targetViewName: "sync.sap.custinfo.view.Detail",
				targetViewType: "XML"
			};
			var oControl = oOptions.currentView;
			var findSplitApp = (function() {
				return  function fn(oControl) {
					var sAncestorControlName = "idAppControl";
					if (oControl instanceof View && oControl.byId(sAncestorControlName)) {
						return oControl.byId(sAncestorControlName);
					}
					return oControl.getParent() ? fn(oControl.getParent(), sAncestorControlName) : null;
				};
			})();
			var oSplitApp = findSplitApp(oControl);
			var oView = myRouter.getView(oOptions.targetViewName, oOptions.targetViewType);
			oSplitApp.addPage(oView, oOptions.isMaster);
			oSplitApp.to(oView.getId(), oOptions.transition || "show", oOptions.data);


		},

		showDetail: function(oItem) {
			var bReplace = Device.is.phone ? false : true;
			UIComponent.getRouterfor(this).navTo("idoVizFrame2", {
				chartType: '1'
			},
			bReplace);
		},

		_setCustBookData : function () {

			var oComponentModel = this.getOwnerComponent().getModel("Compo");
			var oGenderModel = this.getOwnerComponent().getModel("Gender");

			var oCompoData = oComponentModel.oData;
			var oGenderData = oGenderModel.oData;

			var iPlantSCountM = 0;
			var iPlantJCountM = 0;
			var iBookCountM = 0;
			var iRequestCountM = 0;

			var iPlantSCountW = 0;
			var iPlantJCountW = 0;
			var iBookCountW = 0;
			var iRequestCountW = 0;

			for ( var i=0 ; i < oCompoData.length ; i ++) {

				if ( oCompoData[i].Gender === "M" ) {

					if ( oCompoData[i].Plant === "S" ) {

						iPlantSCountM = iPlantSCountM + 1;

					} else if ( oCompoData[i].Plant === "J" ) {

						iPlantJCountM = iPlantJCountM + 1;

					};

					iBookCountM = iBookCountM + 1;

					if ( oCompoData[i].Rqstid != '' ) {

						iRequestCountM = iRequestCountM + 1;

					};

				}
				else if (oCompoData[i].Gender === "F" ) {

					if ( oCompoData[i].Plant === "S" ) {

						iPlantSCountW = iPlantSCountW + 1;

					} else if ( oCompoData[i].Plant === "J" ) {

						iPlantJCountW = iPlantJCountW + 1;

					};

					iBookCountW = iBookCountW + 1;

					if ( oCompoData[i].Rqstid != '' ) {

						iRequestCountW = iRequestCountW + 1;

					};

				}

			};

			oGenderModel.setProperty("/genders/0/plantS", iPlantSCountM);
			oGenderModel.setProperty("/genders/0/plantJ", iPlantJCountM);
			oGenderModel.setProperty("/genders/0/book", iBookCountM);
			oGenderModel.setProperty("/genders/0/request", iRequestCountM);

			oGenderModel.setProperty("/genders/1/plantS", iPlantSCountW);
			oGenderModel.setProperty("/genders/1/plantJ", iPlantJCountW);
			oGenderModel.setProperty("/genders/1/book", iBookCountW);
			oGenderModel.setProperty("/genders/1/request", iRequestCountW);

			// debugger;

		}
		



	});
});
