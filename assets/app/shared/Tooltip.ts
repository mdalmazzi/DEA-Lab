import {
    Directive, HostListener, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver,
    ComponentFactory
} from "@angular/core";
import {TooltipContent} from "./TooltipContent";

@Directive({
    selector: "[tooltip]"
})
export class Tooltip {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private tooltip: ComponentRef<TooltipContent>;
    private visible: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private viewContainerRef: ViewContainerRef,
                private resolver: ComponentFactoryResolver) {
    }

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------

    @Input("tooltip")
    content: string|TooltipContent;

    @Input()
    tooltipDisabled: boolean;

    @Input()
    tooltipAnimation: boolean = true;

    @Input()

    // Max 26112017  da considerare cambio theme o usare quill
   // tooltipPlacement: "top"|"bottom"|"left"|"right" = "bottom";

    tooltipPlacement: "top"|"bottom"|"left"|"right" = "bottom";
    
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    
    @HostListener("click")
    show(): void {
        if (this.tooltipDisabled || this.visible)
            return;

        this.visible = true;
        if (typeof this.content === "string") {
            const factory = this.resolver.resolveComponentFactory(TooltipContent);
            if (!this.visible)
                return;

            this.tooltip = this.viewContainerRef.createComponent(factory);
            this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
            this.tooltip.instance.content = this.content as string;
            this.tooltip.instance.placement = this.tooltipPlacement;
            this.tooltip.instance.animation = this.tooltipAnimation;
        } else {
            const tooltip = this.content as TooltipContent;
            tooltip.hostElement = this.viewContainerRef.element.nativeElement;
            tooltip.placement = this.tooltipPlacement;
            tooltip.animation = this.tooltipAnimation;
            tooltip.show();
        }
    }

    @HostListener("blur")
    hide(): void {
        if (!this.visible)
            return;

        this.visible = false;
        if (this.tooltip)
            this.tooltip.destroy();

        if (this.content instanceof TooltipContent)
            (this.content as TooltipContent).hide();
    }

    

}