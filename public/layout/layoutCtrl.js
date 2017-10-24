(function(){
	'use strict';
	angular
        .module('tamapp')
        .controller('SidebarCtrl',SidebarCtrl)

        SidebarCtrl.inject = ['$scope']
        function SidebarCtrl(){
            var vm = this;

            vm.getCurrentAddress = "here";
        };
});