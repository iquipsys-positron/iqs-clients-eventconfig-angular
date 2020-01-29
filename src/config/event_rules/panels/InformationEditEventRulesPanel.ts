class EventRuleParams {
    public item: iqs.shell.EventRule;
}

interface IInformationEditEventRulePanelBindings {
    [key: string]: any;

    onEventRuleSave: any;
    onEventRuleCancel: any;
    newItem: any;
    editItem: any;
    ngDisabled: any;
}

const InformationEditEventRulePanelBindings: IInformationEditEventRulePanelBindings = {
    // change operational event
    onEventRuleSave: '&iqsSave',
    // add operational event
    onEventRuleCancel: '&iqsCancel',
    // event template for edit
    newItem: '<?iqsNewItem',
    editItem: '<?iqsEditItem',
    ngDisabled: '&?'
}

class InformationEditEventRulePanelChanges implements ng.IOnChangesObject, IInformationEditEventRulePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEventRuleSave: ng.IChangesObject<() => ng.IPromise<void>>;
    onEventRuleCancel: ng.IChangesObject<() => ng.IPromise<void>>;
    newItem: ng.IChangesObject<iqs.shell.EventRule>;
    editItem: ng.IChangesObject<iqs.shell.EventRule>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class InformationEditEventRulePanelController implements ng.IController {
    public $onInit() { }
    public rule: iqs.shell.EventRule;
    public ruleEventRules: iqs.shell.EventRule[];

    public severityCollection: iqs.shell.TypeNumericCollection;
    public ruleTypeMeasure: iqs.shell.TypeCollection;
    public typeCollection: iqs.shell.TypeCollection;
    public signalTypeCollection: any;
    private ruleCalculator: iqs.shell.EventRuleCalculator;
    public error: string = '';
    public phoneValidateError: string = null;
    public emailValidateError: string = null;

    public newItem: iqs.shell.EventRule;
    public editItem: iqs.shell.EventRule;
    public onEventRuleSave: (eventTempl: EventRuleParams) => void;
    public onEventRuleCancel: () => void;
    public ngDisabled: () => boolean;

    // public emails: string;
    // public phones: string;
    public conditionMaxSpeed: number;
    public conditionMinSpeed: number;
    public conditionImmobility: number;
    public conditionPresence: number;

    public form: any;
    public touchedErrorsWithHint: Function;

    public nameCollection: string[];


    //
    public objectInclude: iqs.shell.MultiSelectDialogData[];
    public includeSearch: string;
    public variants: any[];
    private cf: Function[] = [];

    constructor(
        private $element: JQuery,
        private $scope: ng.IScope,
        $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsValidatorsService: iqs.shell.IValidatorsService,
        private iqsAccountsViewModel: iqs.shell.IAccountsViewModel,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        $element.addClass('iqs-event-rule-condition-edit-panel');

        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
        this.ruleCalculator = new iqs.shell.EventRuleCalculator();

        if (this.iqsLoading.isDone) { this.init(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.init(); }));

    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: InformationEditEventRulePanelChanges): void {
        let change: boolean = false;

        if (changes.newItem) {
            if (!_.isEqual(this.newItem, changes.newItem.previousValue)) {
                change = true;
            }
        }

        if (changes.editItem) {
            if (!_.isEqual(this.editItem, changes.editItem.previousValue)) {
                change = true;
            }
        }

        if (change) {
            this.prepare();
        }
    }

    public $postLink() {
        this.form = this.$scope.form;
    }

    private getCollection(collection: any[], collectionIds: string[], type?: string): iqs.shell.MultiSelectDialogData[] {
        let result: iqs.shell.MultiSelectDialogData[] = [];

        _.each(collectionIds, (id: string) => {
            let index = _.findIndex(collection, { id: id });
            if (index != -1) {
                let item = collection[index];
                item.object_type = type;
                result.push(item);
            }
        });

        return result;
    }

    private getIds(collection: any[], entityType?: string): string[] {
        let result: string[] = [];
        _.each(collection, (item: any) => {
            if (entityType && item.object_type == entityType) {
                result.push(item.id);
            }
        });

        return result;
    }

    public getVariantsInclude(search: string) {
        let res = _.filter(this.variants, (variant: any) => {
            return variant.name.toLowerCase().includes(search.toLowerCase()) ||
                variant.id.toLowerCase().includes(search.toLowerCase());
        });

        return _.differenceBy(res, this.objectInclude, 'id');
    }

    private init() {
        this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
        this.ruleTypeMeasure = this.iqsTypeCollectionsService.getEventRuleTypeMeasure();
        this.typeCollection = this.iqsTypeCollectionsService.getEventRuleType();
        this.iqsEventRulesViewModel.read(() => { this.prepare(); });

        // this.signalTypeCollection = this.iqsTypeCollectionService.getSignalType();
        // что бы сохранить параметр
        this.signalTypeCollection = [];
        // this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_NONE', id: SignalType.None });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_ATTENSION', id: iqs.shell.SignalType.Attention });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_WARNING', id: iqs.shell.SignalType.Warning });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_EMERGENCY', id: iqs.shell.SignalType.Emergency });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_CONFIRMATION', id: iqs.shell.SignalType.Confirmation });

        this.prepare();
    }

    private prepare() {
        if (this.editItem) {
            this.rule = _.cloneDeep(this.editItem);
        } else {
            this.rule = _.cloneDeep(this.newItem);
            this.rule.interval = 300; // 300 sec = 15 min
            this.rule.severity = iqs.shell.Severity.Medium;
            this.rule.show_journal = true;
        }
        if (!this.rule.condition) {
            this.rule.condition = {};
        }

        this.variants = [];
        _.each(this.iqsAccountsViewModel.accounts, (item: any) => {
            item.object_type = iqs.shell.SearchObjectTypes.ControlObject;
            this.variants.push(item);
        });


        this.objectInclude = this.getCollection(this.iqsAccountsViewModel.accounts, this.rule.recipient_ids, iqs.shell.SearchObjectTypes.ControlObject);

        this.nameCollection = [];
        // fill collection without editing object
        _.each(this.iqsEventRulesViewModel.getCollection(), (item: iqs.shell.EventRule) => {
            if (this.rule.id && this.rule.id != item.id && item.name || !this.rule.id && item.name) {
                this.nameCollection.push(item.name);
            }
        });

        this.conditionMaxSpeed = null;
        this.conditionMinSpeed = null;
        this.conditionImmobility = null;
        this.conditionPresence = null;

        switch (this.rule.type) {
            case iqs.shell.EventRuleType.MaxSpeed:
                this.conditionMaxSpeed = this.rule.condition[iqs.shell.EventRuleConditionParam.MaxValue] || null;
                break;
            case iqs.shell.EventRuleType.MinSpeed:
                this.conditionMinSpeed = this.rule.condition[iqs.shell.EventRuleConditionParam.MinValue] || null;
                break;
            case iqs.shell.EventRuleType.Immobility:
                this.conditionImmobility = Math.floor(this.rule.condition[iqs.shell.EventRuleConditionParam.Duration] / 60) || null;
                break;
            case iqs.shell.EventRuleType.Presence:
                this.conditionPresence = Math.floor(this.rule.condition[iqs.shell.EventRuleConditionParam.Duration] / 60) || null;
                break;
            default:
                break;
        }
    }

    public isConditionValue(): boolean {
        return this.rule.type == iqs.shell.EventRuleType.MaxSpeed || this.rule.type == iqs.shell.EventRuleType.MinSpeed || this.rule.type == iqs.shell.EventRuleType.Immobility || this.rule.type == iqs.shell.EventRuleType.Presence;
    }

    public getConditionLabel() {
        let label: string = this.ruleCalculator.getEventRuleConditionsLabel(this.rule);

        return this.pipTranslate.translate(label);
    }

    public onChangePhone() {
        this.phoneValidateError = null;
        this.form['phones'].$setValidity('iqsPhoneValidator', true);
    }

    public onChangeEmail() {
        this.emailValidateError = null;
        this.form['emails'].$setValidity('iqsEmailValidator', true);
    }

    public onSaveClick(): void {

        if (this.form.$invalid) {
            this.pipFormErrors.resetFormErrors(this.form, true);

            return;
        }
        this.rule.recipient_ids = this.rule.send_message ? this.getIds(this.objectInclude, iqs.shell.SearchObjectTypes.ControlObject) : [];
        if (this.onEventRuleSave) {
            let condition: number = null;
            switch (this.rule.type) {
                case iqs.shell.EventRuleType.MaxSpeed:
                    condition = this.conditionMaxSpeed;
                    break;
                case iqs.shell.EventRuleType.MinSpeed:
                    condition = this.conditionMinSpeed
                    break;
                case iqs.shell.EventRuleType.Immobility:
                    condition = this.conditionImmobility * 60;
                    break;
                case iqs.shell.EventRuleType.Presence:
                    condition = this.conditionPresence * 60;
                    break;
                default:
                    break;
            }

            this.error = this.ruleCalculator.setEventRuleCondition(this.rule, condition);
            if (!this.error) {
                this.onEventRuleSave({ item: this.rule });
                this.pipFormErrors.resetFormErrors(this.form, false);
            }
        }
    }

    public onCancelClick(): void {
        if (this.onEventRuleCancel) {
            this.onEventRuleCancel();
        }
    }
}

(() => {
    angular
        .module('iqsInformationEditEventRulePanel', ['ValidateDirectives', 'iqsValidatorsService'])
        .component('iqsInformationEditEventRulePanel', {
            bindings: InformationEditEventRulePanelBindings,
            templateUrl: 'config/event_rules/panels/InformationEditEventRulesPanel.html',
            controller: InformationEditEventRulePanelController,
            controllerAs: '$ctrl'
        })
})();
