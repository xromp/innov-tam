(function(){
	'use strict';
	angular
        .module('tamapp')
        .controller('EmployeeCtrl',EmployeeCtrl)
        .controller('EmployeeCreateCtrl',EmployeeCreateCtrl)
        .controller('EmployeeDetailsModalCtrl',EmployeeDetailsModalCtrl)
        .service('EmployeeSrvcs',EmployeeSrvcs)

        EmployeeCtrl.$inject=['$scope', '$state', '$firebaseArray', '$mdDialog']
        function EmployeeCtrl($scope, $state, $firebaseArray, $mdDialog){
            var vm = this;

            vm.showEmpEntry = function() {
                $state.go('employee-create');
            };

            vm.getEmployeeList = function() {
                vm.employeeList = $firebaseArray(employeeRef);
                console.log(vm.employeeList);
            };

            vm.showDetails = function(data, event) {
                $mdDialog.show({
                    controller: EmployeeDetailsModalCtrl,
                    templateUrl: 'employee/employee-details-modal.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    resolve: {
                        formData: function(){
                            return data;
                        }
                    }
                  })
                  .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                  }, function() {
                    $scope.status = 'You cancelled the dialog.';
                  });
            };

            vm.init = function() {
                vm.getEmployeeList();    
            }();
        };

        EmployeeCreateCtrl.$inject=['$scope', '$element', '$filter', '$state', '$stateParams', '$firebaseArray', '$firebaseObject','$mdDialog', 'EmployeeSrvcs']
        function EmployeeCreateCtrl($scope, $element, $filter, $state, $stateParams, $firebaseArray, $firebaseObject, $mdDialog, EmployeeSrvcs) {
            var vm = this;
            vm.employeeList = [];
            vm.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
            $scope.vegetables = ['Corn' ,'Onions' ,'Kale' ,'Arugula' ,'Peas', 'Zucchini'];
            
            if($stateParams.uid){
                vm.action = 'EDIT';
                vm.employeeList.uid = $stateParams.uid;
            } else {
                vm.action = 'CREATE';
            };
            
            $scope.searchTerm;
            $scope.clearSearchTerm = function() {
              $scope.searchTerm = '';
            };

            vm.save = function(data, event) {
                if(vm.frmEmpCreate.$valid) {
                    var dataCopy = data;

                    dataCopy.birthDate = $filter('date')(dataCopy.birthDate,'yyyy-MM-dd');
                    dataCopy.hireDate = $filter('date')(dataCopy.hireDate,'yyyy-MM-dd');
                    dataCopy.name = dataCopy.lname + ', ' + dataCopy.fname + ' ' + dataCopy.mname;
                    
                    
                    if(vm.action == 'CREATE'){
                        var key = employeeRef.push().key;
                        dataCopy.uid = key;
                        
                        employeeRef.child(key).set(dataCopy).then( function(response) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(true)
                                .title('Employee Creation')
                                .textContent('Employee profile has been successfully created!')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('Close')
                                .targetEvent(event)
                            );
                        },function(error) {
                            alert('Something wrong : ', error.message);
                        });
                    } else if (vm.action == 'EDIT') {
                        employeeRef.child(dataCopy.uid).set(dataCopy).then( function(response) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(true)
                                .title('Employee Update')
                                .textContent('Employee profile has been successfully updated!')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('Close')
                                .targetEvent(event)
                            );
                        },function(error) {
                            alert('Something wrong :', error.message);
                        });
                        
                    }
                } else { 
                    return;
                }
                
            };


            vm.back = function(){
                $state.go('employee');
            };

            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
            });

            vm.init = function(){
                vm.approverList = [];
                vm.teamList = [];

                var employeeObj = $firebaseObject(employeeRef)
                employeeObj.$loaded().then(function() {
                    angular.forEach(employeeObj, (value, key)=> {
                        if (value.isApprover) {
                            var data = value;
                            data.uid = key;
                            vm.approverList.push(data);
                        }
                    });
                });

                var teamObj = $firebaseObject(teamRef)
                teamObj.$loaded().then(function() {
                    angular.forEach(teamObj, (value, key)=> {
                        var data = value;
                        data.teamid = key;
                        vm.teamList.push(data);
                    });
                });

                if (vm.action == 'EDIT') {
                    EmployeeSrvcs.getEmpDetails(vm.employeeList).then(function(response){
                        var formData = response[vm.employeeList.uid];
                        formData.birthDate = new Date(formData.birthDate);
                        formData.hireDate = new Date(formData.hireDate);
                        vm.employeeList = formData;

                        console.log(vm.employeeList);
                    },function(error){
                        console.log(error);
                    });
                }

            }();

        };
        
        EmployeeDetailsModalCtrl.$inject = ['$scope', '$state', 'formData', '$filter', '$mdDialog', '$window']
        function EmployeeDetailsModalCtrl($scope, $state, formData, $filter, $mdDialog, $window){
            $scope.employeeDetails = formData;
            $scope.employeeDetails.birthDate = $filter('date')($scope.employeeDetails.birthDate,'dd/MM/yyyy');
            $scope.employeeDetails.hireDate = $filter('date')($scope.employeeDetails.hireDate,'dd/MM/yyyy');
            console.log($scope.employeeDetails);
            $scope.edit = function(){
                $mdDialog.cancel();
                $window.location.href = '/employee/edit/'+$scope.employeeDetails.$id;
            };

            $scope.close = function(){
                $mdDialog.cancel();
            };
        };

        EmployeeSrvcs.$inject=['$firebaseArray', '$firebaseObject', '$q'];
        function EmployeeSrvcs($firebaseArray, $firebaseObject, $q) {
            return {
                getEmpDetails: function(data){
                    var deferred = $q.defer();
                    employeeRef.orderByChild("uid").equalTo(data.uid).once("value", function(dataSnapshot){
                      if(dataSnapshot.exists()){
                        // console.log(dataSnapshot.val());
                        deferred.resolve(dataSnapshot.val());
                      } else {
                        deferred.reject("Not found.");
                      }
                    });
                    return deferred.promise;
                }
            };
        };
	
})();