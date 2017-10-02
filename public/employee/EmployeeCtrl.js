(function(){
	'use strict';
	angular
        .module('tamapp')
        .controller('EmployeeCtrl',EmployeeCtrl)
        .controller('EmployeeCreateCtrl',EmployeeCreateCtrl)

        EmployeeCtrl.$inject=['$state']
        function EmployeeCtrl($state){
            var vm = this;

            vm.employeeList = [
                {'lname':'Pena', 'fname':'Rom', 'name':'Pena, Rom A.', 'role':'CASEHANDLER', 'roledesc':'Case Handler', 'mobileno':'+639211312'},
                {'lname':'Doe', 'fname':'John', 'name': 'Doe, John E.','role':'SUPERVISOR', 'roledesc':'Supervisor', 'mobileno':'+639212021'}
            ]

            vm.showEmpEntry = function() {
                $state.go('employee-create');
            }
        }

        EmployeeCreateCtrl.$inject=['$scope', '$element', '$filter']
        function EmployeeCreateCtrl($scope, $element, $filter) {
            var vm = this;
            vm.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
            $scope.vegetables = ['Corn' ,'Onions' ,'Kale' ,'Arugula' ,'Peas', 'Zucchini'];

            vm.approverList = [
                {uid:1, name:'John'},
                {uid:2, name:'Mark'},
                {uid:3, name:'Jose'}
            ];

            vm.teamList = [
                {teamid:1, name:'Team A'},
                {teamid:2, name:'Team B'},
                {teamid:3, name:'Team C'}
            ];

            $scope.searchTerm;
            $scope.clearSearchTerm = function() {
              $scope.searchTerm = '';
            };

            vm.save = function(data) {
                console.log(vm.frmEmpCreate.$valid);
                // var dataCopy = angular.copy(data);

                // dataCopy.birthDate = $filter('date')(dataCopy.birthday,'yyyy-MM-dd');
                // dataCopy.hireDate = $filter('date')(dataCopy.hireDate,'yyyy-MM-dd');
                
            };

            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
            });

        }
        
	
})();