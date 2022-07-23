# Copyright (c) 2022, Bill Jones and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

def before_install():
	create_docs()
	setup_custom_fields()

# Create custom fields in standard doctypes
def setup_custom_fields():
	custom_fields = {
		"Address": [
			dict(
				fieldname="search_for_address",
				label="Search For Address",
				fieldtype="Data",
				insert_after="address_type",
				read_only=0,
				print_hide=1,
			),
			dict(
				fieldname="business_name",
				label="Business Name",
				fieldtype="Data",
				insert_after="search_for_address",
				read_only=0,
				print_hide=0,
			),
		],
	}

	create_custom_fields(custom_fields)

    # Create custom documents
def create_docs():
    pass
