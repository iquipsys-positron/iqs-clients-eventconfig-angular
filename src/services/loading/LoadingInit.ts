function initPopulating(
    iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
    iqsAccountsViewModel: iqs.shell.IAccountsViewModel,
    pipIdentity: pip.services.IIdentityService,
    iqsLoading: iqs.shell.ILoadingService
) {
    iqsLoading.push('data', [
        iqsEventRulesViewModel.clean.bind(iqsEventRulesViewModel),
        iqsAccountsViewModel.clean.bind(iqsAccountsViewModel)
    ], async.parallel, [
            (callback) => {
                iqsEventRulesViewModel.filter = null;
                iqsEventRulesViewModel.isSort = true;
                iqsEventRulesViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsAccountsViewModel.initAccounts(
                    'all',
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            }
        ]);
    if (pipIdentity.identity && pipIdentity.identity.id) {
        iqsLoading.start();
    }
}


let m: any;
const requires = [
    'iqsEventRules.ViewModel',
    'iqsAccounts.ViewModel',
    'iqsOrganizations.Service',
];

try {
    m = angular.module('iqsLoading');
    m.requires.push(...requires);
    m.run(initPopulating);
} catch (err) { }