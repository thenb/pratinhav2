angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $state) {
	
	
	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	$scope.logout = function() {
		$rootScope.user = {};			
		$scope.user = {};
		window.localStorage.setItem("token", {});
		$scope.modal.hide();
		$state.go('app.login');
	};
	
	
})

.controller('NotificacoesCtrl', function($scope, $stateParams, $state, $q, Restangular, $rootScope) {
	console.log('entrou no Notificacoes?');	
	var promises = [];
	$scope.user = $rootScope.user
	
	function init() {				
	} 
	
	
	function getAllNotifications() {			
		var deffered  = $q.defer();	
		var params = {  id_login : $scope.user.login.id_login };		
		Restangular.all('api/getAllNotifications').post(JSON.stringify(params)).then(function(not) {				
			console.log(not);	
			deffered.resolve(not);
			$scope.notificacoes	= not;		
		});
		return deffered.promise;
	} 
	
	
	function setReadNotification(item) {	
		var deffered  = $q.defer();	
		var params = {  notificacao : item };		
			Restangular.all('api/setReadNotification').post(JSON.stringify(params)).then(function(not) {				
				deffered.resolve(not);				
			});
		return deffered.promise;
	} 
	
	
	$scope.goBack = function() {
		$state.go('app.dashboard');
	};
	
	$scope.set_color = function (item) {
		if (item.lida == 0) {
			return { "background-color": "#f8f8f8" }
		}else{
			return { "background-color": "#ffffff" }
		}
	}	
	
	$scope.verificar = function (item){
		var promise = [];		
		promise.push(setReadNotification(item));
		$q.all(promise).then(
			function() {
				$state.go('app.notificacao', {notificacao: item });
			}
		);
	}
	
	promises.push(getAllNotifications());		
	
	$q.all(promises).then(
		function() {
			init();		
		}	
	);	
	
})

.controller('NotificacaoCtrl', function($scope, $stateParams, $state, $q, Restangular, $rootScope) {
	
	console.log($state.params.notificacao);
	$scope.notificacao = $state.params.notificacao;	
	
	$scope.goBack = function() {
		$state.go('app.notificacoes');
	};	
	
	$scope.goNoticia = function() {
		var url = $scope.notificacao.url;
		window.open(url, '_system', 'location=yes');
	};	

	
})

.controller('WelcomeCtrl', function($scope, $stateParams, $state, ionicMaterialMotion, ionicMaterialInk, $timeout, $rootScope , Restangular, $q) {
	console.log('entrou no Dashboard?');
	var promises = [];		
		
	$scope.user = $rootScope.user;
	console.log($rootScope.user);			
	  
	function init() {				
	} 
	
	function getAllPontByIdEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.user.especificador.id };		
		Restangular.all('api/getAllPontByIdEspec').post(JSON.stringify(params)).then(function(pont) {			
			var total =  0;
			pont.map(function(item){
				total+= item.pontos;				
			});			
			deffered.resolve(total);
			$scope.pontuacaoAtual = total;
		});
		return deffered.promise;
	}	
	
	function getTotalIndicacoes() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.user.especificador.id };		
		Restangular.all('api/getTotalIndicacoes').post(JSON.stringify(params)).then(function(qtd) {				
			deffered.resolve(qtd);
			$scope.totalIndicacoes = qtd[0].qtd;
		});
		return deffered.promise;
	}

	function getAllUnreadNotifications() {			
		var deffered  = $q.defer();	
		var params = {  id_login : $scope.user.login.id_login };		
		Restangular.all('api/getAllUnreadNotifications').post(JSON.stringify(params)).then(function(qtd) {				
			deffered.resolve(qtd);
			console.log(qtd);
			$scope.totalUnreadNotification = qtd[0].qtd;
		});
		return deffered.promise;
	} 
	
	
	
	function getAllEmpresasPresenca() {			
		var deffered  = $q.defer();	
		console.log($scope.user);
		var params = {  id_empresa : $scope.user.empresa.id };		
		Restangular.all('api/getAllPresencaByEmpresa').post(JSON.stringify(params)).then(function(presenca) {			
			deffered.resolve(presenca);
			$scope.totalPresencas = presenca[0].qtdPresencaCampanhaAtiva;			
		});
		return deffered.promise;
	} 
	
	function getAllEmpresasVisited() {			
		var deffered  = $q.defer();	
		var params = {  id_login : $scope.user.login.id_login };		
		Restangular.all('api/getAllEmpresasVisited').post(JSON.stringify(params)).then(function(empresas) {			
			deffered.resolve(empresas);
			$scope.totalVisitas = empresas.length;			
		});
		return deffered.promise;
	} 
	
	function checkNewDispositivo(token) {			
		console.log('chamou a rota?')
		var deffered  = $q.defer();	
		var params = {  id_login : $scope.user.login.id_login , token : token  };		
		Restangular.all('api/checkNewDispositivo').post(JSON.stringify(params)).then(function(resp) {			
			deffered.resolve(resp);
		});
		return deffered.promise;
	}
	
	$scope.configFCM = function() {
		if (typeof FCMPlugin != 'undefined') {				
			FCMPlugin.getToken(function(token){
				console.log(token)
				var promisesToken = [];
				promisesToken.push(checkNewDispositivo(token));
				$q.all(promisesToken).then(function() {
					console.log(token)	
				});
						
			});
			FCMPlugin.onNotification(function(data){
				console.log('entrou?')
				if(data.wasTapped){
				//Notification was received on device tray and tapped by the user.
				$state.go('app.notificacoes');
				}else{
				//Notification was received in foreground. Maybe the user needs to be notified.
				$state.go('app.notificacoes');
				}
			});
		}	
	};	
	
	
	$scope.goBack = function() {
		$state.go('app.login');
	};	
	
	
	if($scope.user.login.id_tipo_login ==2){
		promises.push(getAllEmpresasPresenca());
	}

	if($scope.user.login.id_tipo_login !=1 || $scope.user.login.id_tipo_login !=2 ){
		promises.push(getAllEmpresasVisited());
	}
	
	if($scope.user.especificador){
		promises.push(getAllPontByIdEspec());
		promises.push(getTotalIndicacoes());
	}		
	
	promises.push(getAllUnreadNotifications())
	
	$q.all(promises).then(
		function() {
			init();		
		}	
	);
})

.controller('PerfilCtrl', function($scope, $stateParams, $state, $rootScope,  $q, Restangular ) {
	
	$scope.tabs=0;
	
	$scope.goBack = function() {
		$state.go('app.dashboard');
	};
	
	$scope.changeTabs = function(tab) {
		$scope.tabs=tab;
	};
	
	$scope.user = $rootScope.user;
	console.log($scope.user);
	if($scope.user.especificador){
		$scope.perfil = angular.copy($scope.user.especificador);
	}	
	if($scope.user.cliente){
		$scope.perfil = angular.copy($scope.user.cliente);
	}	
	if($scope.user.empresa){
		$scope.perfil = angular.copy($scope.user.empresa);
	}
	$scope.login = angular.copy($rootScope.user.login);
	
		
	function editarNomeEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, nome : $scope.perfil.nome  };		
		Restangular.all('/api/especificadorUpdateNome').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarNomeCliente() {
		console.log('entrou?')
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, nome : $scope.perfil.nome  };		
		Restangular.all('/api/clienteUpdateNome').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarNomeEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, nome : $scope.perfil.nome  };		
		Restangular.all('/api/empresaUpdateNome').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarSobrenomeEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, sobrenome : $scope.perfil.sobrenome  };		
		Restangular.all('/api/especificadorUpdateSobrenome').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarSobrenomeCliente() {
		console.log($scope.perfil)
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, sobrenome : $scope.perfil.sobrenome  };		
		Restangular.all('/api/clienteUpdateSobrenome').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarEmpresaSegmento() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, segmento : $scope.perfil.segmento  };		
		Restangular.all('/api/empresaUpdateSegmento').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarEmpresaEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, empresa : $scope.perfil.empresa  };		
		Restangular.all('/api/especificadorUpdateEmpresa').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}

	function editarEmpresaCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, empresa : $scope.perfil.empresa  };		
		Restangular.all('/api/clienteUpdateEmpresa').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}	
	
	function editarNascimentoEspec() {			
		var deffered  = $q.defer();	
		$scope.perfil.data_nascimento = moment($scope.perfil.data_nascimento, "DD-MM-YYYY");   		
		var params = {  id_especificador : $scope.perfil.id, nascimento : $scope.perfil.data_nascimento  };		
		Restangular.all('/api/especificadorUpdateNascimento').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarNascimentoCliente() {			
		var deffered  = $q.defer();	
		$scope.perfil.data_nascimento = moment($scope.perfil.data_nascimento, "DD-MM-YYYY");   		
		var params = {  id_cliente : $scope.perfil.id, nascimento : $scope.perfil.data_nascimento  };		
		Restangular.all('/api/clienteUpdateDataNascimento').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarCpfEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, cpf : $scope.perfil.cpf  };		
		Restangular.all('/api/especificadorUpdateCpf').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarRgEspec() {			
	var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, rg : $scope.perfil.rg  };		
		Restangular.all('/api/especificadorUpdateRg').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarTelefoneEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, telefone : $scope.perfil.telefone  };		
		Restangular.all('/api/especificadorUpdateTelefone').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarTelefoneCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, telefone : $scope.perfil.telefone  };		
		Restangular.all('/api/clienteUpdateTelefone').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarTelefoneEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, telefone : $scope.perfil.telefone  };		
		Restangular.all('/api/empresaUpdateTelefone1').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarCelularEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, celular : $scope.perfil.celular  };		
		Restangular.all('/api/empresaUpdateTelefone2').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarCelularCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, celular : $scope.perfil.celular  };		
		Restangular.all('/api/clienteUpdateCelular').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;		
	}
	
	function editarCelularEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, telefone2 : $scope.perfil.celular  };		
		Restangular.all('/api/empresaUpdateTelefone2').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarProfissaoEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, profissao : $scope.perfil.profissao  };		
		Restangular.all('/api/especificadorUpdateProfissao').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarCepEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, cep : $scope.perfil.cep  };		
		Restangular.all('/api/especificadorUpdateCep').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarCepCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, cep : $scope.perfil.cep  };		
		Restangular.all('/api/clienteUpdateCep').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarCepEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, cep : $scope.perfil.cep  };		
		Restangular.all('/api/empresaUpdateCep').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarEnderecoEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, endereco : $scope.perfil.endereco  };		
		Restangular.all('/api/especificadorUpdateEndereco').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarEnderecoCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, endereco : $scope.perfil.endereco  };		
		Restangular.all('/api/clienteUpdateEndereco').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarEnderecoEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, endereco : $scope.perfil.endereco  };		
		Restangular.all('/api/empresaUpdateEndereco').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarNumeroEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, numero : $scope.perfil.numero  };		
		Restangular.all('/api/especificadorUpdateNumero').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarNumeroCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, numero : $scope.perfil.numero  };		
		Restangular.all('/api/clienteUpdateNumero').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarNumeroEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, numero : $scope.perfil.numero  };		
		Restangular.all('/api/empresaUpdateNumero').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarBairroEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, bairro : $scope.perfil.bairro  };		
		Restangular.all('/api/especificadorUpdateBairro').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarBairroCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, bairro : $scope.perfil.bairro  };		
		Restangular.all('/api/clienteUpdateBairro').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarBairroEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, bairro : $scope.perfil.bairro  };		
		Restangular.all('/api/empresaUpdateBairro').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarCidadeEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, cidade : $scope.perfil.cidade  };		
		Restangular.all('/api/especificadorUpdateCidade').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarCidadeCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, cidade : $scope.perfil.cidade  };		
		Restangular.all('/api/clienteUpdateCidade').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarCidadeEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, cidade : $scope.perfil.cidade  };		
		Restangular.all('/api/empresaUpdateCidade').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarUfEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, uf : $scope.perfil.uf  };		
		Restangular.all('/api/especificadorUpdateUf').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarUfCliente() {			
		var deffered  = $q.defer();	
		var params = {  id_cliente : $scope.perfil.id, uf : $scope.perfil.uf  };		
		Restangular.all('/api/clienteUpdateUf').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarUfEmpresa() {			
		var deffered  = $q.defer();	
		var params = {  id_empresa : $scope.perfil.id, uf : $scope.perfil.uf  };		
		Restangular.all('/api/empresaUpdateUf').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;	
	}
	
	function editarDadosEspec() {			
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.perfil.id, dados_bancarios : $scope.perfil.dados_bancarios  };		
		Restangular.all('/api/especificadorUpdateDados').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}
	
	function editarSenhaPerfil() {			
		var deffered  = $q.defer();	
		var params = {  id_login : $scope.login.id_login, senha : $scope.login.novaSenha  };		
		Restangular.all('/api/perfilUpdateSenha').post(JSON.stringify(params)).then(function(espec) {					
			deffered.resolve(espec);			
		});
		return deffered.promise;
	}	
	
	
	$scope.salvar = function (formPerfil) {			
		var promises = [];	
		if(formPerfil.nome.$dirty){
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarNomeEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarNomeCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarNomeEmpresa());
			}			
		}
		
		if(formPerfil.nome.$dirty){
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarNomeEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarNomeCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarNomeEmpresa());
			}			
		}
		
		if(formPerfil.sobrenome.$dirty){
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarSobrenomeEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarSobrenomeCliente());
			}					
		}
		
		if(formPerfil.empresa.$dirty){
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarEmpresaEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarEmpresaCliente());
			}			
		}

		if(formPerfil.segmento.$dirty){
			promises.push(editarEmpresaSegmento());						
		}
		
		if(formPerfil.data_nascimento.$dirty){
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarNascimentoEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarNascimentoCliente());
			}			
		}
		
		if(formPerfil.cpf.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarCpfEspec());
			}						
		}
		
		if(formPerfil.rg.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarRgEspec());
			}							
		}	

		if(formPerfil.telefone.$dirty){	
			console.log('entrou?')
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarTelefoneEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarTelefoneCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarTelefoneEmpresa());
			}			
		}else{
			formPerfil.telefone.$invalid = false;
			
		}
		
		if(formPerfil.celular.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarCelularEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarCelularCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarCelularEmpresa());
			}			
		}
		
		if(formPerfil.profissao.$dirty){			
			promises.push(editarProfissaoEspec());	
		}
		
		if(formPerfil.cep.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarCepEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarCepCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarCepEmpresa());
			}
		}
		
		if(formPerfil.endereco.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarEnderecoEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarEnderecoCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarEnderecoEmpresa());
			}
		}
		
		if(formPerfil.numero.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarNumeroEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarNumeroCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarNumeroEmpresa());
			}
		}
		
		if(formPerfil.bairro.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarBairroEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarBairroCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarBairroEmpresa());
			}
		}
		
		if(formPerfil.cidade.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarCidadeEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarCidadeCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarCidadeEmpresa());
			}
		}
		
		if(formPerfil.uf.$dirty){			
			if($scope.user.login.id_tipo_login==3){
				promises.push(editarUfEspec());
			}
			if($scope.user.login.id_tipo_login==4){
				promises.push(editarUfCliente());
			}
			if($scope.user.login.id_tipo_login==2){
				promises.push(editarUfEmpresa());
			}
		}
		
		if(formPerfil.dados_bancarios.$dirty){			
			promises.push(editarDadosEspec());	
		}

		if(formPerfil.senha.$dirty && formPerfil.repetir_senha.$dirty){
			if($scope.login.novaSenha == $scope.login.repetirNovaSenha  ){
				promises.push(editarSenhaPerfil());	
				formPerfil.repetir_senha.$setValidity("diferentes", true);
			}else{
				formPerfil.repetir_senha.$setValidity("diferentes", false);
				formPerfil.$invalid= true;
			}
			
		}
		
		$q.all(promises).then(function(retorno) {
				console.log(formPerfil);
				if(!formPerfil.$invalid){
					if($rootScope.user.especificador){
						$rootScope.user.especificador =  $scope.perfil;						
					}
					if($rootScope.user.cliente){
						console.log('entrou no cliente?')
						console.log($scope.perfil);
						$rootScope.user.cliente =  $scope.perfil;
					}	
					if($rootScope.user.empresa){
						$rootScope.user.empresa =  $scope.perfil;
					}					
					$state.go('app.dashboard');				
				}					
		});		
	};	
})

.controller('LoginCtrl', function($scope, $stateParams,  $state, Restangular, $q, $ionicSideMenuDelegate, $rootScope) {
	$ionicSideMenuDelegate.canDragContent(false);
	console.log('entrou no login?');	
	$scope.user = {};	
	var lembrou = window.localStorage.getItem("lembrar");
	window.localStorage.setItem("token", {});
	
	if(lembrou=='false'){
		lembrou = false;
	}else{
		lembrou = true;
	}
	
	if(lembrou){
			if(typeof window.localStorage.getItem("email")!='undefined'){
				$scope.user.email = window.localStorage.getItem("email")
			}
			if(typeof window.localStorage.getItem("senha")!='undefined'){
				$scope.user.senha = window.localStorage.getItem("senha")
			}
			  $scope.user.lembrar = true;
	}else{		
		$scope.user.email= "";
		$scope.user.senha = "";
		$scope.user.lembrar = false;
	}
	
	function login(user) {			
		var params = {  user : user };	
		var deffered  = $q.defer();	
		Restangular.all('doLogin').post(JSON.stringify(params)).then(function(user) {			
			if (user.error) {
				 deffered.reject(user.error);
			}else{
				deffered.resolve(user);
				localStorage.setItem("token", user.token);
				if(!$scope.user.lembrar){
					$scope.user = {};
					window.localStorage.setItem("email", {});
					window.localStorage.setItem("senha", {});
					window.localStorage.setItem("lembrar", false);
				}else{
					window.localStorage.setItem("email", $scope.user.email);
					window.localStorage.setItem("senha", $scope.user.senha);
					window.localStorage.setItem("lembrar", $scope.user.lembrar);
				}
			}			
		});
		return deffered.promise;
	}
	
	
	$scope.login = function(formLogin) {
		formLogin.senha1.$setValidity("naoExiste", true);
		window.localStorage.setItem("token", {});
		var promises = [];
		console.log(formLogin);
		if(!formLogin.$invalid){
			promises.push(login($scope.user));	
		}
		
		$q.all(promises).then(function(retorno) {
			if(!formLogin.$invalid){
				if(retorno.lenght!=0){
					if(retorno[0].type!=1){
						var decoded = jwt_decode(window.localStorage.getItem("token"));		
						$rootScope.user = decoded.user;
						$state.go('app.dashboard');
						formLogin.senha1.$setValidity("naoExiste", true);
					}else{
						formLogin.senha1.$setValidity("naoExiste", false);
						console.log(retorno[0].msg);
					}				
				}	
			}					
		});
	};	
})

.controller('EspecificadoresCtrl', function($scope, $stateParams, $state, $q, Restangular, $rootScope ) {
	console.log('entrou no especificadores?');		
	$scope.especificadores = [];
	var promises = [];
	$scope.user = $rootScope.user;
	
	function init() {			
			console.log('especificadores');
			console.log($scope.especificadores);
	}
	
	function getAllEspec() {			
		var deffered  = $q.defer();		
		Restangular.one('api/getAllEspec').getList().then(function(users) {			
			$scope.especificadores = users;
			deffered.resolve(users);
		});
		return deffered.promise;
	}	
	
	promises.push(getAllEspec());	
	
	$q.all(promises).then(
		function() {
			init();		
		}	
	);

	$scope.detalhes = function(especificador) {
		$state.go('app.especificador', {especificador: especificador });
	};
	
	$scope.goBack = function() {
		$state.go('app.dashboard');
	};
})

.controller('EspecificadorCtrl', function($scope, $stateParams, $state, $q, Restangular ) {
	console.log('entrou no especificador?');
	console.log($state.params.especificador);
	$scope.especificador1 = $state.params.especificador;
	$scope.tabs=0;	
	
	$scope.changeTabs = function(tab) {
		$scope.tabs=tab;
	};	
	
	$scope.goBack = function() {
		$state.go('app.especificadores');
	};
})



.controller('EmpresasCtrl', function($scope, $stateParams, $state, $q, Restangular, $rootScope ) {
	console.log('entrou no empresas?');	
	$scope.empresas = [];	
	var promises = [];	
	$scope.user = $rootScope.user;
	
	function init() {			
		console.log($scope.empresas);				
	}	
	
	function getAllEmpre() {			
		var deffered  = $q.defer();		
		Restangular.one('api/getAllEmpresas').getList().then(function(users) {
			$scope.empresas = users;
			deffered.resolve(users);
		});
		return deffered.promise;
	}
	
	$scope.detalhes = function (empresa) {
		$state.go('app.empresa', {empresa: empresa });
	};	
	
	$scope.goBack = function() {
		$state.go('app.dashboard');
	};
	
	promises.push(getAllEmpre());	
	
	$q.all(promises).then(
		function() {
			init();		
		}	
	);	
})

.controller('EmpresaCtrl', function($scope, $stateParams, $state, $q, Restangular ) {
	console.log('entrou na empresa?');	
	$scope.empresa1 = $state.params.empresa;
	
	var promisesInit = [];	
	
	$scope.tabs=0;	
	
	$scope.changeTabs = function(tab) {
		$scope.tabs=tab;
	};	
	
	$scope.goBack = function() {
		$state.go('app.empresas');
	};
	
	function init() {
		
	
	}
	
	function getInfoEmpresa() {			
		var params = {  id_empresa : $scope.empresa1.id };	
		var deffered  = $q.defer();				
		Restangular.all('api/getInfoEmpresa').post(JSON.stringify(params)).then(function(emp) {		
			console.log(emp);
			if (emp.error) {
				 deffered.reject(emp.error);
			}else{
				$scope.empresa1.email = emp[0].email;
				$scope.empresa1.nome_usuario = emp[0].nome;
				deffered.resolve(emp);
			}
			
		});
		return deffered.promise;
	}
	
	promisesInit.push(getInfoEmpresa());	
	
	
	$q.all(promisesInit).then(function() {
			console.log();
			init();		
		}	
	);
	
})

.controller('ClientesCtrl', function($scope, $stateParams, $state, $q, Restangular, $rootScope ) {
	console.log('entrou no clientes?');	
	$scope.clientes = [];	
	$scope.user = $rootScope.user;
	console.log($scope.user);
	
	
	var promises = [];	
	
	function init() {			
		console.log($scope.clientes);				
	}	
	
	function getAllClientes() {			
		var deffered  = $q.defer();		
		Restangular.one('api/getAllClientes').getList().then(function(users) {
			$scope.clientes = users;
			deffered.resolve(users);
		});
		return deffered.promise;
	}
	
	$scope.detalhes = function (cliente) {
		$state.go('app.cliente', {cliente: cliente });
	};	
	
	$scope.goBack = function() {
		$state.go('app.dashboard');
	};

	promises.push(getAllClientes());	
	
	$q.all(promises).then(
		function() {
			init();		
		}	
	);	
})

.controller('ClienteCtrl', function($scope, $stateParams, $state,$q, Restangular) {
	console.log('entrou na cliente?');	
	$scope.cliente1 = $state.params.cliente;
	$scope.tabs=0;

	function init() {
		console.log($scope.cliente1);
		console.log($scope.especificadores);
		$scope.especificadores.map(function(espe) {			  
			if(espe.id == $scope.cliente1.id_indicou ){					
				$scope.indicou = espe;
				console.log($scope.indicou );
			}			
			if(espe.id == $scope.cliente1.id_especificador){
				$scope.especificador = espe;
				console.log($scope.especificador );
			}				
		});
	}

	function getAllEspecNoPoints() {			
		var deffered  = $q.defer();		
		Restangular.one('api/getAllEspecForIndicacao').getList().then(function(especificadores) {
			$scope.especificadores = especificadores;
			deffered.resolve(especificadores);
		});
		return deffered.promise;
	}	
	
	var promisesInit = [];
	
	if($scope.cliente1.fase1){
		$scope.cliente1.fase1 = true;
	}else{
		$scope.cliente1.fase1 = false;
	}
	
	if($scope.cliente1.fase2){
		$scope.cliente1.fase2 = true;
	}else{
		$scope.cliente1.fase2 = false;
	}
	
	if($scope.cliente1.fase3){
		$scope.cliente1.fase3 = true;
	}else{
		$scope.cliente1.fase3 = false;
	}
	
	if($scope.cliente1.fase4){
		$scope.cliente1.fase4 = true;
	}else{
		$scope.cliente1.fase4 = false;
	}
	
	if($scope.cliente1.fase5){
		$scope.cliente1.fase5 = true;
	}else{
		$scope.cliente1.fase5 = false;
	}
	
	if($scope.cliente1.fase6){
		$scope.cliente1.fase6 = true;
	}else{
		$scope.cliente1.fase6 = false;
	}
	
	if($scope.cliente1.fase7){
		$scope.cliente1.fase7 = true;
	}else{
		$scope.cliente1.fase7 = false;
	}
	
	if($scope.cliente1.fase8){
		$scope.cliente1.fase8 = true;
	}else{
		$scope.cliente1.fase8 = false;
	}
	
	if($scope.cliente1.fase9){
		$scope.cliente1.fase9 = true;
	}else{
		$scope.cliente1.fase9 = false;
	}
	
	$scope.changeTabs = function(tab) {
		$scope.tabs=tab;
	};	
	
	$scope.goBack = function() {
		$state.go('app.clientes');
	};
	
	promisesInit.push(getAllEspecNoPoints());
	
	
	$q.all(promisesInit).then(function() {			
			init();		
		}	
	);
	
	
	
})

.controller('PontuacoesCtrl', function($scope, $stateParams, $state , $q, Restangular, $rootScope) {
	console.log('entrou no pontuacoes?');
	$scope.campanhaAtual = '';
	$scope.pontuacoes = [];	
	$scope.campanhas = [];		
	$scope.pontuacaoAtual = [];
	$scope.user = $rootScope.user;
	var promises = [];	
	
	
	function init() {					
	}	
	
	function getAllPointsCampanhaAtiva() {
		var deffered  = $q.defer();	
		var params = {  id_especificador : $scope.user.especificador.id };		
		Restangular.all('api/getAllPointsCampanhaAtiva').post(JSON.stringify(params)).then(function(pont) {			
			$scope.pontuacoes = pont;	
			console.log($scope.pontuacoes);		
			deffered.resolve(pont);
		});
		return deffered.promise;
		
	}
	
	function getIdCampAtiva() {			
		var deffered  = $q.defer();		
		Restangular.one('api/getIdCampAtiva').getList().then(function(camp) {
			console.log(camp);
			$scope.campanhaAtual = camp[0].id;
			deffered.resolve(camp);
		});
		return deffered.promise;
	}
	
	function getAllCamp() {			
		var deffered  = $q.defer();		
		Restangular.one('api/getAllCamp').getList().then(function(camp) {
			$scope.campanhas = camp;
			deffered.resolve(camp);
		});
		return deffered.promise;
	}
	
	function getAllPontByIdEspec() {			
		var deffered  = $q.defer();	
		 var params = {  id_especificador : $scope.user.especificador.id };		
		Restangular.all('api/getAllPontByIdEspec').post(JSON.stringify(params)).then(function(pont) {			
			var total =  0;
			pont.map(function(item){
				total+= item.pontos;				
			});			
			deffered.resolve(total);
			$scope.pontuacaoAtual = total;
		});
		return deffered.promise;
	}
	
	//functions on view
	$scope.changeCampPoints = function(campanhaAtual) {				
		console.log('rolou?')
		 var params = {  id_campanha : campanhaAtual, id_especificador:  $scope.user.especificador.id };		
		Restangular.all('api/getAllPontByCampId').post(JSON.stringify(params)).then(function(camp) {
			$scope.pontuacoes = camp;	
			console.log($scope.pontuacoes);
		});
		
	};
	
	$scope.goBack = function() {
		$state.go('app.dashboard');
	};
	
	promises.push(getAllPointsCampanhaAtiva());
	promises.push(getIdCampAtiva());
	promises.push(getAllCamp());
	promises.push(getAllPontByIdEspec());
	
	$q.all(promises).then(
		function() {
			init();		
		}	
	);
	
})

.controller('VisitasCtrl', function($scope, $stateParams, $state, $rootScope,  $q, Restangular ) {
	console.log('entrou nos visitas');
	var promises = [];	
	$scope.empresas = [];
	$scope.user = $rootScope.user;
	
	function init() {			
		console.log($scope.empresas);				
	}
	
	function getAllEmpreVisited(id_login) {			
		var params = {  id_login : id_login };	
		var deffered  = $q.defer();				
		Restangular.all('api/getAllEmpresasVisited').post(JSON.stringify(params)).then(function(espec) {		
			if (espec.error) {
				 deffered.reject(espec.error);
			}else{
				deffered.resolve(espec);
				$scope.empresas = espec ;
				console.log(espec);
			}
			
		});
		return deffered.promise;
	}
	
	$scope.goBack = function() {
		$state.go('app.dashboard');
	};	
	
	promises.push(getAllEmpreVisited($scope.user.login.id_login));		
		
	$q.all(promises).then(
		function() {
			init();		
		}	
	);	
})

;
