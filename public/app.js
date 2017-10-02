(function(){
	'use strict';
	angular
		.module('tamapp',['ngMaterial', 'ngRoute', 'ngAnimate' ,'ui.router'])
		.config(Config)

		Config.$inject = ['$routeProvider', '$urlRouterProvider', '$stateProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider'];
		function Config( $routeProvider, $urlRouterProvider, $stateProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider){
			$locationProvider.html5Mode(true);
			

			$stateProvider
			// HOME STATES AND NESTED VIEWS ========================================
			.state('dashboard', {
				url: '/dashboard',
				templateUrl: 'dashboard/dashboard.html',
				controller:'DashboardCtrl',
				controllerAs:'dc'
			})
			.state('employee', {
				url: '/employee',
				templateUrl:'employee/employee-list.html',
				controller:'EmployeeCtrl',
					controllerAs:'ec'
			})
			.state('employee-create', {
				url: '/employee/create',
				templateUrl:'employee/employee-create.html',
				controller:'EmployeeCreateCtrl',
					controllerAs:'ecc'
			})
			$urlRouterProvider.otherwise('/dashboard');
		}
})();