"""Setup for comparison XBlock."""

from __future__ import absolute_import

import os

from setuptools import setup


def package_data(pkg, roots):
    """Generic function to find package_data.

    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.

    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='comparison-xblock',
    version='0.0.1',
    description='XBlock which allows you to create comparison tests',
    packages=[
        'comparison',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'comparison = comparison:ComparisonXBlock',
        ]
    },
    package_data=package_data('comparison', ['static', 'public', 'translations']),
)
