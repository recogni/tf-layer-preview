from setuptools import setup, find_packages

setup(name="tf_layer_preview",
    version="0.0.1",
    description="Tensorflow layer previewer",
    url="https://github.com/recogni/tf-layer-preview",
    author="sabhiram",
    install_requires=[
        "tornado"
    ],
    packages=find_packages())
