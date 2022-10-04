# Copyright (c) 2022, Bill Jones and contributors
# For license information, please see license.txt

import frappe
#from frappe import _
#from frappe.model.document import Document
#from frappe.custom.doctype.custom_field.custom_field import create_custom_fields
import requests

@frappe.whitelist()
def uk_postcode_lookup( postcode, all_caps=False ):
	url = "https://pcls1.craftyclicks.co.uk/json/rapidaddress/?"

	payload = {
		'postcode': postcode,
		'key': key(),
		'lines': 2,
		'response': 'data_formatted'
	}

	r = requests.get(url, params=payload)
	data = r.json()

	# Convert data to the requested case
	i = 0
	while i < data['delivery_point_count']:
		data['delivery_points'][i]['organisation_name'] = leading_caps( data['delivery_points'][i]['organisation_name'], all_caps )
		data['delivery_points'][i]['department_name'] = leading_caps( data['delivery_points'][i]['department_name'], all_caps )
		data['delivery_points'][i]['line_1'] = leading_caps( data['delivery_points'][i]['line_1'], all_caps )
		data['delivery_points'][i]['line_2'] = leading_caps( data['delivery_points'][i]['line_2'], all_caps )
		i += 1

	data['postal_county'] = leading_caps( data['postal_county'], all_caps )
	data['traditional_county'] = leading_caps( data['traditional_county'], all_caps )
	data['town'] = leading_caps( data['town'], all_caps )

	return data


def key():
	return frappe.db.get_single_value('Fetchify Settings', 'click_to_address_token')


def leading_caps( txt, all_caps=False ):
	if all_caps or (2 > len( txt )):
		return txt

	out_text = ''
	words = txt.split( ' ' )
	for word in words:
		word = word.strip()
		if word != '':
			if out_text != '':
				out_text = out_text + ' '

			out_text = out_text + cp_uc( word )

	return out_text


def cp_uc( text ):
	if 'PC' == text or 'UK' == text or 'EU' == text:
		return text

	alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	out_text = ''
	do_uc = True
	all_uc = False
	i = 0

	for ch in text:
		if alpha.find( ch ) != -1:
			if do_uc or all_uc:
				out_text = out_text + ch
				do_uc = False
			else:
				out_text = out_text + ch.lower()
		else:
			out_text = out_text + ch
			if i+2 >= len( text ) and "'" == ch: # only one more char left, don't capitalise
				do_uc = False
			elif '(' == ch:
				close_idx = text.find( ')', i+1 )
				if i+3 < close_idx:				# more than 2 chars
					all_uc = False
					do_uc = True
				else: 							# no closing bracket or 2 or fewer chars in brackets, leave upper-case
					all_uc = True
			elif ")" == ch:
				all_uc = False
				do_uc = True
			elif "-" == ch:
				close_idx = text.find( '-', i+1 )
				if (-1 != close_idx and i+3 >= close_idx) or i+3 >= len( text ): # less than 2 chars
					all_uc = False
					do_uc = False
				else:							# 2 or more chars
					all_uc = False
					do_uc = True
			elif i+2 < len( text ) and '0' <= ch and '9' >= ch:
				do_uc = False
			else:
				do_uc = True
			
		i += 1
	
	return out_text
