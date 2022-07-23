from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in fetchify/__init__.py
from fetchify import __version__ as version

setup(
	name="fetchify",
	version=version,
	description="Integrate Fetchify ClickToAddress postcode lookup into ERPNext",
	author="SAABits Ltd.",
	author_email="billj@saabits.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
