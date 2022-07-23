// Copyright (c) 2022, Bill Jones and contributors
// For license information, please see license.txt

// Address form actions

frappe.ui.form.on('Address', {
	refresh(frm) {
		// your code here
		
		// This is how to include an external .js file
        // create new script tag
        var cc_script = document.createElement('script');
        // set "src" of script tag
        // can be relative or full url
        cc_script.src = 'https://cc-cdn.com/generic/scripts/v1/cc_c2a.min.js';
        
        var input_search = document.querySelectorAll("[data-fieldname='search_for_address']")[1];

        
        // Loaded successfully
        cc_script.onload = function()
        {
			// Get the settings for the form
			frappe.db.get_doc('Fetchify Settings')
                .then(settings => {
                    
                    var token = settings.click_to_address_token;
                    var gfxMode = settings.gfxmode == 'Below' ? 1 : 2;
                    var placeholder_texts = {};
                    var enabled_countries = [];
                    $.each( settings.enabled_countries, function(index, country) {
                        enabled_countries.push( country['country_code'] );
                      });

                    var input_town = document.querySelectorAll("[data-fieldname='city']")[1];
                    var input_postcode = document.querySelectorAll("[data-fieldname='pincode']")[1];
                    var input_line_1 = document.querySelectorAll("[data-fieldname='address_line1']")[1];
                    var input_line_2 = document.querySelectorAll("[data-fieldname='address_line2']")[1];
                    var input_state = document.querySelectorAll("[data-fieldname='state']")[1];
                    var input_company = document.querySelectorAll("[data-fieldname='business_name']")[1];
                    var input_country = document.querySelectorAll("[data-fieldname='country']")[1];

                    var userLang = navigator.language || navigator.userLanguage;

                    if( settings.placeholders )
                    {
                        if( settings.default_placeholder )
                            placeholder_texts.default_placeholder = settings.default_placeholder;
                        if( settings.country_placeholder )
                            placeholder_texts.country_placeholder = settings.country_placeholder;
                        if( settings.country_button )
                            placeholder_texts.country_button = settings.country_button;
                        if( settings.generic_error )
                            placeholder_texts.generic_error = settings.generic_error;
                        if( settings.no_results )
                            placeholder_texts.no_results = settings.no_results;
                        if( settings.more )
                            placeholder_texts.more = settings.more;
                        
                    }

                    new clickToAddress(
                    {
                        accessToken: token,
                        dom:
                        {
                            search:     input_search,
                            town:       input_town,
                            postcode:   input_postcode,
                            line_1:     input_line_1,
                            line_2:     input_line_2,
                            county:     input_state,
                            company:    input_company,
                            country:    input_country
                        },
                    
                        domMode: 'object', // Use objects to find form elements
                        gfxMode: gfxMode, // Display interface around search box
                        style:
                        {
                            ambient: settings.ambient, // Main interface color
                            accent: settings.accent // Secondary color for interface
                        },
                        
                        // Use a custom CSS file
                        //cssPath: 'https://yoursite.com/your_asset_folder/clicktoaddress/cc_c2a.min.css',
                        placeholders: settings.placeholders, // Show placeholders
                        texts: placeholder_texts,                      
                        showLogo: settings.show_logo, // Show ClickToAddress logo
                        historyTools: settings.show_history, // Show arrows
                        defaultCountry: settings.default_country_code, // Sets the default country if IP location disabled
                        getIpLocation: settings.get_ip_location, // Sets default country based on IP
                        countrySelector: settings.country_selector, // Country list is enabled
                        enabledCountries: enabled_countries, // Enabled countries
                        countryMatchWith: 'iso_2', // enabledCountries uses ISO_2 codes
                        countryLanguage: userLang, // Country list displayed in browser language
                        disableAutoSearch: false, // Auto-search is always enabled
                        transliterate: settings.transliterate,
                        useCeremonialCounties: settings.use_ceremonial_counties,

                        onResultSelected:
                            function(c2a, elements, address)
                            {
                                // ClickToAddress sets the HTML input fields but we must transfer that
                                // data to the document fields before it can be submitted with the document
                                frm.doc.business_name = address.company_name;
                                frm.doc.address_line1 = address.line_1;
                                frm.doc.address_line2 = address.line_2;
                                frm.doc.city = address.locality;
                                frm.doc.state = address.province_name;
                                frm.doc.country = address.country["country_name"];
                                frm.doc.pincode = address.postal_code;
                            }
                    });
                });
                    
        };
        
        // Loading failed
        cc_script.onerror = function()
        {
        	alert( 'cc_script load failed' );
        };
        
        // append new script to html
        document.body.appendChild(cc_script);
        
        // By default, Address Title will have the focus
        // If that is already set then focus on the address search field as it's
        // likely that is what we want to change
        if( frm.doc.address_title !== "" )
        {
            input_search.focus();
        }
	},
	
	before_save( frm )
	{
	    // Just before saving the document, clear the "search" field so we don't save it
        frm.doc.search_for_address = "";
        input_search.value = "";
	}
})
