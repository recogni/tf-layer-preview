#!/usr/bin/env python

import tensorflow as tf
from preview import PreviewServer


def generator():
    for i in range(1, 100, 1):
        yield "This is message %d" % (i), i


def main():
    ps = PreviewServer()

    o_types = (tf.string, tf.int64)
    dataset = tf.data.Dataset.from_generator(generator, output_types=o_types)

    # Define batch size
    dataset = dataset.batch(2)
    iter = dataset.make_one_shot_iterator()

    x, y = iter.get_next()
    x, y = ps.op([x, y], (tf.string, tf.int64))
    op   = tf.Print(x, [x, y], "X,Y =")

    # Run the session.
    with tf.Session() as sess:
        sess.run(op)
        sess.run(op)


if __name__ == "__main__":
    main()
