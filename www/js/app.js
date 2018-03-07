// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic-material','restangular','ngMessages','ngLoadingSpinner','ui.utils.masks', 'starter.controllers'])

//valida as tokens no http
.factory('authInterceptor', function ($rootScope, $window, $q) {
	 return {
		request: function (config) {
			config.headers = config.headers || {};
			if ($window.localStorage['token']) {					
				config.headers.Authorization = 'Bearer ' + localStorage.getItem("token");
			}
			return config;
		},
		response: function (response) {
			return response || $q.when(response);
		},
		responseError: function (response) {
			if (response.status === 401) {
				$window.location.href = 'index.html';
			}
			return $q.reject(response);
		}
	};
	
})




.run(function($ionicPlatform, $rootScope, $location) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}	
	});	
	$rootScope.user = {};	
	
	
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, RestangularProvider,  $httpProvider) {
	$stateProvider
		.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.dashboard', {
		cache: false,
		url: '/dashboard',
		views: {
			'menuContent': {
				templateUrl: 'templates/welcome.html',
				controller: 'WelcomeCtrl'
		  }
		}
	})
  
	.state('app.login', {
		cache: false,
		url: '/login',      
		views: {
			'menuContent': {
				templateUrl: 'templates/login.html',
				controller: 'LoginCtrl' 
			}
		}     
	})

	.state('app.perfil', {
		cache: false,
		url: '/perfil',
		views: {
			'menuContent': {
				templateUrl: 'templates/perfil.html',
				controller: 'PerfilCtrl' 
        }
      }
    })
    .state('app.notificacoes', {
		cache: false,
		url: '/notificacoes',
		views: {
			'menuContent': {
				templateUrl: 'templates/notificacoes.html',
				controller: 'NotificacoesCtrl'
        }
      }
    })

	.state('app.especificadores', {
		cache: false,
		url: '/especificadores',
		views: {
			'menuContent': {
				templateUrl: 'templates/especificadores.html',
				controller: 'EspecificadoresCtrl'
        }
		}
	})
	
	.state('app.especificador', {
		cache: false,
		url: '/especificador',
		views: {
			'menuContent': {
				templateUrl: 'templates/especificador.html',
				controller: 'EspecificadorCtrl'
        }
		},
		params: {especificador: null }	
	})
	
	.state('app.empresas', {
		cache: false,
		url: '/empresas',
		views: {
			'menuContent': {
				templateUrl: 'templates/empresas.html',
				controller: 'EmpresasCtrl'
        }
		}
	})
	
	.state('app.empresa', {
		cache: false,
		url: '/empresa',
		views: {
			'menuContent': {
				templateUrl: 'templates/empresa.html',
				controller: 'EmpresaCtrl'
        }
		},
		params: {empresa: null }	
	})
	
	.state('app.visitas', {
		cache: false,
		url: '/visitas',
		views: {
			'menuContent': {
				templateUrl: 'templates/visitas.html',
				controller: 'VisitasCtrl'
        }
		}
	})	
	
	.state('app.clientes', {
		cache: false,
		url: '/clientes',
		views: {
			'menuContent': {
				templateUrl: 'templates/clientes.html',
				controller: 'ClientesCtrl'
        }
		}
	})
	
	.state('app.cliente', {
		cache: false,
		url: '/cliente',
		views: {
			'menuContent': {
				templateUrl: 'templates/cliente.html',
				controller: 'ClienteCtrl'
        }
		},
		params: {cliente: null }	
	})
	
	.state('app.notificacao', {
		cache: false,
		url: '/notificacao',
		views: {
			'menuContent': {
				templateUrl: 'templates/notificacao.html',
				controller: 'NotificacaoCtrl'
        }
		},
		params: {notificacao: null }
	})
	
	.state('app.pontuacoes', {
		cache: false,
		url: '/pontuacoes',
		views: {
			'menuContent': {
				templateUrl: 'templates/pontuacoes.html',
				controller: 'PontuacoesCtrl'
        }
		}
	});
	
	
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
  //RestangularProvider.setBaseUrl('https://prata.herokuapp.com/');
  RestangularProvider.setBaseUrl('http://ec2-54-233-210-28.sa-east-1.compute.amazonaws.com:9002/');
  $httpProvider.interceptors.push('authInterceptor');
  
});
