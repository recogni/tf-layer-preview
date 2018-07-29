from setuptools import setup, find_packages

setup(name="tf_layer_preview",
    version="0.0.2",
    description="Tensorflow layer previewer",
    url="https://github.com/recogni/tf-layer-preview",
    author="sabhiram",
    install_requires=[
        "tornado"
    ],
    packages=["tf_layer_preview"],
    package_dir={"tf_layer_preview": "preview"})
