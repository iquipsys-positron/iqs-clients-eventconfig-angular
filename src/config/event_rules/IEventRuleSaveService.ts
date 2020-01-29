export interface IEventRuleSaveService {
    ruleId: string;
    currState: string;
    search: string;
    rule: iqs.shell.EventRule;
    section: number;
    editActions: boolean;
}
