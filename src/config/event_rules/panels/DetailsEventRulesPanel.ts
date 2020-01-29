import { IEventRuleSaveService } from '../IEventRuleSaveService';

class EventRulesTabs {
    title: string;
    id: number;
}

class EventRuleParams {
    public item: iqs.shell.EventRule;
}

interface IEventRulePanelBindings {
    [key: string]: any;

    onEventRuleEdit: any;
    onEventRuleDelete: any;
    onEventRuleSave: any;
    item: any;
    ngDisabled: any;
    details: any;
}

const EventRulePanelBindings: IEventRulePanelBindings = {
    onEventRuleEdit: '&iqsEdit',
    onEventRuleDelete: '&iqsDelete',
    onEventRuleSave: '&iqsSave',
    item: '<?iqsEventRuleItem',
    ngDisabled: '&?',
    details: '<?iqsDetails'
}

class EventRulePanelChanges implements ng.IOnChangesObject, IEventRulePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEventRuleEdit: ng.IChangesObject<() => ng.IPromise<void>>;
    onEventRuleDelete: ng.IChangesObject<() => ng.IPromise<void>>;
    onEventRuleSave: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<iqs.shell.EventRule>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
    details: ng.IChangesObject<boolean>;
}

class EventRulePanelController implements ng.IController {
    public $onInit() { }
    public item: iqs.shell.EventRule;
    public onEventRuleEdit: () => void;
    public onEventRuleDelete: () => void;
    public onEventRuleSave: (params: EventRuleParams) => void;
    public ngDisabled: () => boolean;
    public accessConfig: any;
    public severityCollection: iqs.shell.TypeNumericCollection;
    public ruleTypeMeasure: iqs.shell.TypeCollection;
    public ruleType: iqs.shell.TypeCollection;
    public signalTypeCollection: iqs.shell.TypeNumericCollection;
    public details: boolean;
    public section: number;
    public sections: EventRulesTabs[] = [
        { title: 'RULES_TAB_INFORMATION', id: 0 },
        { title: 'RULES_TAB_OBJECTS', id: 1 },
        { title: 'RULES_TAB_ZONES', id: 2 }
    ];

    public zonesInclude: iqs.shell.MultiSelectDialogData[];
    public zonesExclude: iqs.shell.MultiSelectDialogData[];
    public objectInclude: iqs.shell.MultiSelectDialogData[];
    public objectExclude: iqs.shell.MultiSelectDialogData[];
    private debounceSave: Function;
    public objectType: string;
    private cf: Function[] = [];

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsEventRuleSaveService: IEventRuleSaveService,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsZonesViewModel: iqs.shell.IZonesViewModel,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        private iqsMultiSelectDialog: iqs.shell.IMultiSelectDialogService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-event-rule-details');
        this.accessConfig = iqsAccessConfig.getStateConfigure().access;
        const runWhenReady = () => {
            this.severityCollection = this.iqsTypeCollectionsService.getSeverity();
            this.ruleTypeMeasure = this.iqsTypeCollectionsService.getEventRuleTypeMeasure();
            this.ruleType = this.iqsTypeCollectionsService.getEventRuleType();
            this.signalTypeCollection = this.iqsTypeCollectionsService.getSignalType();

            this.section = this.$location.search()['section'] || this.iqsEventRuleSaveService.section || this.sections[0].id;
            this.selectSection(this.section);

            this.objectType = iqs.shell.SearchObjectTypes.ControlObject;

            this.debounceSave = _.debounce(() => {
                this.onEventRuleSave({ item: this.item });
            }, 500);
        };

        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady.bind(this)));
    }

    public $onDestroy() {
        this.iqsEventRuleSaveService.section = this.section;
        for (const f of this.cf) { f(); }
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

    private prepare() {

        let includeObjects: iqs.shell.MultiSelectDialogData[];
        let includeObjectGroups: iqs.shell.MultiSelectDialogData[];
        let excludeObjects: iqs.shell.MultiSelectDialogData[];
        let excludeObjectGroups: iqs.shell.MultiSelectDialogData[];

        includeObjects = this.getCollection(this.iqsObjectsViewModel.allObjects, this.item.include_object_ids, iqs.shell.SearchObjectTypes.ControlObject);
        includeObjectGroups = this.getCollection(this.iqsObjectGroupsViewModel.getCollection(
            () => {
                this.prepare();
            }
        ), this.item.include_group_ids, iqs.shell.SearchObjectTypes.ObjectGroup);
        excludeObjects = this.getCollection(this.iqsObjectsViewModel.allObjects, this.item.exclude_object_ids, iqs.shell.SearchObjectTypes.ControlObject);
        excludeObjectGroups = this.getCollection(this.iqsObjectGroupsViewModel.getCollection(
            () => {
                this.prepare();
            }
        ), this.item.exclude_group_ids, iqs.shell.SearchObjectTypes.ObjectGroup);

        this.objectInclude = _.unionBy(includeObjects, includeObjectGroups, 'id');
        this.objectExclude = _.unionBy(excludeObjects, excludeObjectGroups, 'id');
        this.zonesInclude = this.getCollection(this.iqsZonesViewModel.zones, this.item.include_zone_ids, iqs.shell.SearchObjectTypes.Zone);
        this.zonesExclude = this.getCollection(this.iqsZonesViewModel.zones, this.item.exclude_zone_ids, iqs.shell.SearchObjectTypes.Zone);
    }

    public $onChanges(changes: EventRulePanelChanges): void {
        this.prepare();
    }

    private saveEventRule() {
        if (this.onEventRuleSave) {
            this.debounceSave();
        }
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

    public onIncludeObject() {
        this.iqsMultiSelectDialog.show(
            {
                dialogTitle: 'RULES_OBJECT_INCLUDE_TITLE',
                entityType: iqs.shell.SearchObjectTypes.ObjectsAndGroups,
                initCollection: this.objectInclude,
                configState: 'app.objects',
                addButtonLabel: 'EVENT_RULE_DIALOG_INCLUDE_ADD'
            },
            (res: iqs.shell.SearchResult[]) => {
                this.item.include_object_ids = this.getIds(res, iqs.shell.SearchObjectTypes.ControlObject);
                this.item.include_group_ids = this.getIds(res, iqs.shell.SearchObjectTypes.ObjectGroup);
                this.saveEventRule();
            },
            () => {

            });
    }

    public onExcludeObject() {
        this.iqsMultiSelectDialog.show(
            {
                dialogTitle: 'RULES_OBJECT_EXCLUDE_TITLE',
                entityType: iqs.shell.SearchObjectTypes.ObjectsAndGroups,
                initCollection: this.objectExclude,
                configState: 'app.objects',
                addButtonLabel: 'EVENT_RULE_DIALOG_EXCLUDE_ADD'
            },
            (res: iqs.shell.SearchResult[]) => {
                this.item.exclude_object_ids = this.getIds(res, iqs.shell.SearchObjectTypes.ControlObject);
                this.item.exclude_group_ids = this.getIds(res, iqs.shell.SearchObjectTypes.ObjectGroup);
                this.saveEventRule();
            },
            () => {

            });
    }

    public onIncludeZone() {
        this.iqsMultiSelectDialog.show(
            {
                dialogTitle: 'RULES_ZONES_INCLUDE_TITLE',
                entityType: iqs.shell.SearchObjectTypes.Zone,
                initCollection: this.zonesInclude,
                configState: 'app.zones',
                addButtonLabel: 'EVENT_RULE_DIALOG_INCLUDE_ADD'
            },
            (res: iqs.shell.SearchResult[]) => {
                this.item.include_zone_ids = this.getIds(res, iqs.shell.SearchObjectTypes.Zone);
                this.saveEventRule();
            },
            () => {

            });
    }

    public onExcludeZone() {
        this.iqsMultiSelectDialog.show(
            {
                dialogTitle: 'RULES_ZONES_EXCLUDE_TITLE',
                entityType: iqs.shell.SearchObjectTypes.Zone,
                initCollection: this.zonesExclude,
                configState: 'app.zones',
                addButtonLabel: 'EVENT_RULE_DIALOG_EXCLUDE_ADD'
            },
            (res: iqs.shell.SearchResult[]) => {
                this.item.exclude_zone_ids = this.getIds(res, iqs.shell.SearchObjectTypes.Zone);
                this.saveEventRule();
            },
            () => {

            });
    }

    public onChange() {
        if (this.ngDisabled && this.ngDisabled()) return;

        this.saveEventRule();
    }

    public onDeleteEntry(type, item) {
        if (this.ngDisabled && this.ngDisabled()) return;

        switch (type) {
            case 'zonesInclude':
                _.remove(this.zonesInclude, { id: item.id });
                this.item.include_zone_ids = this.getIds(this.zonesInclude, iqs.shell.SearchObjectTypes.Zone);
                this.saveEventRule();
                break;
            case 'zonesExclude':
                _.remove(this.zonesExclude, { id: item.id });
                this.item.exclude_zone_ids = this.getIds(this.zonesExclude, iqs.shell.SearchObjectTypes.Zone);
                this.saveEventRule();
                break;
            case 'objectInclude':
                _.remove(this.objectInclude, { id: item.id });
                this.item.include_object_ids = this.getIds(this.objectInclude, iqs.shell.SearchObjectTypes.ControlObject);
                this.item.include_group_ids = this.getIds(this.objectInclude, iqs.shell.SearchObjectTypes.ObjectGroup);
                this.saveEventRule();
                break;
            case 'objectExclude':
                _.remove(this.objectExclude, { id: item.id });
                this.item.exclude_object_ids = this.getIds(this.objectExclude, iqs.shell.SearchObjectTypes.ControlObject);
                this.item.exclude_group_ids = this.getIds(this.objectExclude, iqs.shell.SearchObjectTypes.ObjectGroup);
                this.saveEventRule();
                break;
            default:
                break;
        }
    }

    public selectSection(id: number) {
        this.$location.search('section', this.section);
    }

    public onEdit(item: iqs.shell.EventRule): void {
        if (this.onEventRuleEdit) {
            this.onEventRuleEdit();
        }
    }

    public onDelete(item: iqs.shell.EventRule): void {
        if (this.onEventRuleDelete) {
            this.onEventRuleDelete();
        }
    }
}

(() => {
    angular
        .module('iqsDetailsEventRulePanel', ['iqsFormats.ObjectFilter'])
        .component('iqsDetailsEventRulePanel', {
            bindings: EventRulePanelBindings,
            templateUrl: 'config/event_rules/panels/DetailsEventRulesPanel.html',
            controller: EventRulePanelController,
            controllerAs: '$ctrl'
        })
})();
