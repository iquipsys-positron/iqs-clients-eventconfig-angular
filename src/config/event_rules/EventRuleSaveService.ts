import { IEventRuleSaveService } from './IEventRuleSaveService';

class EventRuleSaveService implements IEventRuleSaveService {
    private _ruleId: string;
    private _currState: string;
    private _section: number;
    private _search: string;
    private _rule: iqs.shell.EventRule;
    private _editActions: boolean

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
    ) {
        "ngInject";

    }

    public set rule(rule: iqs.shell.EventRule) {
        this._rule = rule;
    }

    public get rule(): iqs.shell.EventRule {
        return this._rule;
    }

    public set ruleId(ruleId: string) {
        this._ruleId = ruleId;
    }

    public get ruleId(): string {
        return this._ruleId;
    }

    public set currState(currState: string) {
        this._currState = currState;
    }

    public get currState(): string {
        return this._currState;
    }

    public set section(section: number) {
        this._section = section;
    }

    public get section(): number {
        return this._section;
    }
    
    public set search(search: string) {
        this._search = search;
    }

    public get search(): string {
        return this._search;
    }
    
    public set editActions(editActions: boolean) {
        this._editActions = editActions;
    }

    public get editActions(): boolean {
        return this._editActions;
    }

}

{
    angular.module('iqsConfigEventRules.SaveService', [])
        .service('iqsEventRuleSaveService', EventRuleSaveService);

}