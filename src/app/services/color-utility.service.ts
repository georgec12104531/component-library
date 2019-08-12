import { Injectable } from '@angular/core';
import * as jQuery from 'jquery';
import { UtilityService} from './utility.service';

@Injectable()
export class ColorUtilityService {

  public colorPalette: PartnerColorPalette

  constructor(){}

  loadStyleSheets(styleUrls: string[]) {
		for (let i = 0; i < styleUrls.length; i++) {
			if (document.getElementById('custom-style' + i)) {
				// remove element
				jQuery('link[title="custom-style' + i + '"]').remove();
			}
			const link = document.createElement('link');
			link.title = 'custom-style' + i;
			link.id = 'custom-style' + i;
			link.rel = 'stylesheet';
			link.href = styleUrls[i];
			
			document.head.appendChild(link);
		}
  }
  
  public buildStylesFromColorPalette(colorPalette: PartnerColorPalette) {
		let colorPaletteCSS = '<style id=\'customCSS\' type=\'text/css\'>';
		colorPaletteCSS += this.buildColors(colorPalette) + this.buildBackgroundColors(colorPalette)
		colorPaletteCSS += ('</style>');
		jQuery(colorPaletteCSS).appendTo('head');
	}
  
  private buildBackgroundColors(colorPalette: PartnerColorPalette): string {
		const backgroundStyles = '' +
		`	
		.primary-color-bg,
		.switch label .lever:before, 
		.daterangepicker td.active, 
		.daterangepicker td.active:hover,
		.ranges .range_inputs .btn { ` + 
			'background-color: ' + colorPalette.primaryColor + ' !important' +
		'}' +
		'.primary-color-bg { ' +
			'background-color: ' + colorPalette.primaryColor + ' !important' +
		'}' +
		'.secondary-color-bg { ' +
			'background-color: ' + colorPalette.secondaryColor + ' !important' +
		'}' +
		'.tertiary-color-bg { ' +
			'background-color: ' + colorPalette.tertiaryColor + ' !important' +
		'}' +
		'.quaternary-color-bg { ' +
			'background-color: ' + colorPalette.quaternaryColor + ' !important' +
		'}' +
		'.quinary-color-bg { ' +
			'background-color: ' + colorPalette.quinaryColor + ' !important' +
		'}' +
		`
		.span.lever,
		.switch label input[type=checkbox]:checked+.lever,
		.switch label .lever { ` +
			'background-color: ' + UtilityService.addOpacity(colorPalette.primaryColor, 20) + ' !important' +
		'}' +
		'.switch label .lever:after {' + 
			'background-color: ' + colorPalette.primaryColor + ' !important' +
		'}';

		return backgroundStyles;
	}

	private buildColors(colorPalette: PartnerColorPalette): string {
		const colorStyles = '' +
			'.primary-color { ' +
			'color: ' + colorPalette.primaryColor + ' !important' +
			'}' +
			'.secondary-color { ' +
			'color: ' + colorPalette.secondaryColor + ' !important' +
			'}' +
			'.tertiary-color { ' +
			'color: ' + colorPalette.tertiaryColor + ' !important' +
			'}' +
			'.quaternary-color { ' +
			'color: ' + colorPalette.quaternaryColor + ' !important' +
			'}' +
			'.quinary-color { ' +
			'color: ' + colorPalette.quinaryColor + ' !important' +
			'}';
		return colorStyles;
	}
}