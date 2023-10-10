/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ id='comment-123', threadId='thread-123', owner='user-123', content='Lorem ipsum sit dolor', date=new Date().toISOString, isDelete = false}) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, owner, content, date, isDelete],
    };

    await pool.query(query);
  },

  async addDeleteComment({ id='comment-123', threadId='thread-123', owner='user-123', content='Lorem ipsum sit dolor', date=new Date().toISOString}) {
    await this.addComment({ id, threadId, owner, content, date, isDelete: true  });
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
