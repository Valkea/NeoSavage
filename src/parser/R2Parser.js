// Generated from R2.g4 by ANTLR 4.9.2
// jshint ignore: start
import antlr4 from 'antlr4';
import R2Listener from './R2Listener.js';
import R2Visitor from './R2Visitor.js';

const serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786",
    "\u5964\u0003=\u0102\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004",
    "\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007",
    "\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f",
    "\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010",
    "\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0007\u0002(\n\u0002\f\u0002\u000e\u0002+\u000b\u0002\u0003\u0002",
    "\u0005\u0002.\n\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0007\u0003;\n\u0003\f\u0003\u000e\u0003>\u000b\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0005",
    "\u0003F\n\u0003\u0003\u0003\u0005\u0003I\n\u0003\u0003\u0003\u0003\u0003",
    "\u0005\u0003M\n\u0003\u0003\u0003\u0005\u0003P\n\u0003\u0003\u0004\u0005",
    "\u0004S\n\u0004\u0003\u0004\u0003\u0004\u0005\u0004W\n\u0004\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0005\u0005n\n\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0005\u0005y\n\u0005\u0003\u0005\u0003\u0005\u0005\u0005",
    "}\n\u0005\u0003\u0005\u0007\u0005\u0080\n\u0005\f\u0005\u000e\u0005",
    "\u0083\u000b\u0005\u0003\u0006\u0005\u0006\u0086\n\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0005\u0006\u008b\n\u0006\u0003\u0006\u0005",
    "\u0006\u008e\n\u0006\u0003\u0007\u0003\u0007\u0005\u0007\u0092\n\u0007",
    "\u0003\b\u0003\b\u0005\b\u0096\n\b\u0003\b\u0003\b\u0003\b\u0003\b\u0005",
    "\b\u009c\n\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0005\b",
    "\u00a4\n\b\u0003\t\u0005\t\u00a7\n\t\u0003\t\u0003\t\u0003\t\u0003\t",
    "\u0005\t\u00ad\n\t\u0003\t\u0005\t\u00b0\n\t\u0003\n\u0003\n\u0003\n",
    "\u0005\n\u00b5\n\n\u0003\u000b\u0003\u000b\u0003\u000b\u0007\u000b\u00ba",
    "\n\u000b\f\u000b\u000e\u000b\u00bd\u000b\u000b\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0005\f\u00c6\n\f\u0003\f\u0005\f",
    "\u00c9\n\f\u0003\f\u0003\f\u0005\f\u00cd\n\f\u0003\f\u0005\f\u00d0\n",
    "\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0005\r\u00d8\n\r",
    "\u0003\r\u0003\r\u0003\r\u0003\r\u0005\r\u00de\n\r\u0003\r\u0003\r\u0003",
    "\r\u0005\r\u00e3\n\r\u0005\r\u00e5\n\r\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0003\u000f\u0005\u000f\u00eb\n\u000f\u0003\u000f\u0003\u000f",
    "\u0003\u0010\u0005\u0010\u00f0\n\u0010\u0003\u0010\u0003\u0010\u0003",
    "\u0011\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0005\u0012\u00fb\n\u0012\u0003\u0012\u0003\u0012\u0003\u0012",
    "\u0005\u0012\u0100\n\u0012\u0003\u0012\u0002\u0003\b\u0013\u0002\u0004",
    "\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e ",
    "\"\u0002\u0015\u0003\u0002\u0004\u0005\u0003\u0002\b\t\u0003\u0002\n",
    "\u000b\u0003\u0002\u0012\u0013\u0003\u0002\u000e\u0010\u0003\u0002\u0014",
    "\u0015\u0003\u0002\u0017\u001c\u0003\u0002\u001d\u001e\u0003\u0002\u001f",
    " \u0003\u0002!\"\u0003\u0002#$\u0003\u0002%&\u0003\u0002\'(\u0003\u0002",
    ")*\u0003\u0002+,\u0003\u0002-.\u0003\u0002/0\u0003\u000213\u0003\u0002",
    "46\u0002\u012c\u0002$\u0003\u0002\u0002\u0002\u0004O\u0003\u0002\u0002",
    "\u0002\u0006R\u0003\u0002\u0002\u0002\bm\u0003\u0002\u0002\u0002\n\u0085",
    "\u0003\u0002\u0002\u0002\f\u0091\u0003\u0002\u0002\u0002\u000e\u00a3",
    "\u0003\u0002\u0002\u0002\u0010\u00a6\u0003\u0002\u0002\u0002\u0012\u00b1",
    "\u0003\u0002\u0002\u0002\u0014\u00b6\u0003\u0002\u0002\u0002\u0016\u00cf",
    "\u0003\u0002\u0002\u0002\u0018\u00e4\u0003\u0002\u0002\u0002\u001a\u00e6",
    "\u0003\u0002\u0002\u0002\u001c\u00ea\u0003\u0002\u0002\u0002\u001e\u00ef",
    "\u0003\u0002\u0002\u0002 \u00f3\u0003\u0002\u0002\u0002\"\u00ff\u0003",
    "\u0002\u0002\u0002$)\u0005\u0004\u0003\u0002%&\u0007\u0003\u0002\u0002",
    "&(\u0005\u0004\u0003\u0002\'%\u0003\u0002\u0002\u0002(+\u0003\u0002",
    "\u0002\u0002)\'\u0003\u0002\u0002\u0002)*\u0003\u0002\u0002\u0002*-",
    "\u0003\u0002\u0002\u0002+)\u0003\u0002\u0002\u0002,.\u0007\u0003\u0002",
    "\u0002-,\u0003\u0002\u0002\u0002-.\u0003\u0002\u0002\u0002./\u0003\u0002",
    "\u0002\u0002/0\u0007\u0002\u0002\u00030\u0003\u0003\u0002\u0002\u0002",
    "1P\u0005\b\u0005\u000223\u0005\"\u0012\u000234\t\u0002\u0002\u00024",
    "5\u0005\b\u0005\u00025P\u0003\u0002\u0002\u000267\u0005\"\u0012\u0002",
    "78\t\u0002\u0002\u00028<\u0007\u0006\u0002\u00029;\u0005\u0006\u0004",
    "\u0002:9\u0003\u0002\u0002\u0002;>\u0003\u0002\u0002\u0002<:\u0003\u0002",
    "\u0002\u0002<=\u0003\u0002\u0002\u0002=?\u0003\u0002\u0002\u0002><\u0003",
    "\u0002\u0002\u0002?@\u0007\u0007\u0002\u0002@P\u0003\u0002\u0002\u0002",
    "AB\u0005\"\u0012\u0002BC\t\u0003\u0002\u0002CE\u0005\"\u0012\u0002D",
    "F\u0005\u0018\r\u0002ED\u0003\u0002\u0002\u0002EF\u0003\u0002\u0002",
    "\u0002FH\u0003\u0002\u0002\u0002GI\u0005\u001a\u000e\u0002HG\u0003\u0002",
    "\u0002\u0002HI\u0003\u0002\u0002\u0002IP\u0003\u0002\u0002\u0002JL\t",
    "\u0004\u0002\u0002KM\u0005\u001a\u000e\u0002LK\u0003\u0002\u0002\u0002",
    "LM\u0003\u0002\u0002\u0002MP\u0003\u0002\u0002\u0002NP\u0007<\u0002",
    "\u0002O1\u0003\u0002\u0002\u0002O2\u0003\u0002\u0002\u0002O6\u0003\u0002",
    "\u0002\u0002OA\u0003\u0002\u0002\u0002OJ\u0003\u0002\u0002\u0002ON\u0003",
    "\u0002\u0002\u0002P\u0005\u0003\u0002\u0002\u0002QS\u0007:\u0002\u0002",
    "RQ\u0003\u0002\u0002\u0002RS\u0003\u0002\u0002\u0002ST\u0003\u0002\u0002",
    "\u0002TV\u0005\b\u0005\u0002UW\u0007\u0003\u0002\u0002VU\u0003\u0002",
    "\u0002\u0002VW\u0003\u0002\u0002\u0002W\u0007\u0003\u0002\u0002\u0002",
    "XY\b\u0005\u0001\u0002Yn\u0005\n\u0006\u0002Zn\u0005\u0010\t\u0002[",
    "n\u0005\u0012\n\u0002\\n\u0005\u001c\u000f\u0002]n\u0005\u001e\u0010",
    "\u0002^n\u0005 \u0011\u0002_n\u0005\u0014\u000b\u0002`a\u0005\u0018",
    "\r\u0002ab\u0007\f\u0002\u0002bc\u0005\b\u0005\tcn\u0003\u0002\u0002",
    "\u0002de\u0007=\u0002\u0002ef\u0007\r\u0002\u0002fn\u0005\b\u0005\b",
    "gh\u00079\u0002\u0002hi\u0007\u0011\u0002\u0002in\u00079\u0002\u0002",
    "jk\t\u0005\u0002\u0002kn\u0005\b\u0005\u0004ln\u0005\"\u0012\u0002m",
    "X\u0003\u0002\u0002\u0002mZ\u0003\u0002\u0002\u0002m[\u0003\u0002\u0002",
    "\u0002m\\\u0003\u0002\u0002\u0002m]\u0003\u0002\u0002\u0002m^\u0003",
    "\u0002\u0002\u0002m_\u0003\u0002\u0002\u0002m`\u0003\u0002\u0002\u0002",
    "md\u0003\u0002\u0002\u0002mg\u0003\u0002\u0002\u0002mj\u0003\u0002\u0002",
    "\u0002ml\u0003\u0002\u0002\u0002n\u0081\u0003\u0002\u0002\u0002op\f",
    "\u0007\u0002\u0002pq\t\u0006\u0002\u0002q\u0080\u0005\b\u0005\brs\f",
    "\u0005\u0002\u0002st\t\u0005\u0002\u0002t\u0080\u0005\b\u0005\u0006",
    "uv\f\n\u0002\u0002vx\u0007\u0006\u0002\u0002wy\u0005\b\u0005\u0002x",
    "w\u0003\u0002\u0002\u0002xy\u0003\u0002\u0002\u0002yz\u0003\u0002\u0002",
    "\u0002z|\u0007\f\u0002\u0002{}\u0005\b\u0005\u0002|{\u0003\u0002\u0002",
    "\u0002|}\u0003\u0002\u0002\u0002}~\u0003\u0002\u0002\u0002~\u0080\u0007",
    "\u0007\u0002\u0002\u007fo\u0003\u0002\u0002\u0002\u007fr\u0003\u0002",
    "\u0002\u0002\u007fu\u0003\u0002\u0002\u0002\u0080\u0083\u0003\u0002",
    "\u0002\u0002\u0081\u007f\u0003\u0002\u0002\u0002\u0081\u0082\u0003\u0002",
    "\u0002\u0002\u0082\t\u0003\u0002\u0002\u0002\u0083\u0081\u0003\u0002",
    "\u0002\u0002\u0084\u0086\u0005\"\u0012\u0002\u0085\u0084\u0003\u0002",
    "\u0002\u0002\u0085\u0086\u0003\u0002\u0002\u0002\u0086\u0087\u0003\u0002",
    "\u0002\u0002\u0087\u0088\t\u0007\u0002\u0002\u0088\u008a\u0005\f\u0007",
    "\u0002\u0089\u008b\u0007\u0016\u0002\u0002\u008a\u0089\u0003\u0002\u0002",
    "\u0002\u008a\u008b\u0003\u0002\u0002\u0002\u008b\u008d\u0003\u0002\u0002",
    "\u0002\u008c\u008e\u0005\u000e\b\u0002\u008d\u008c\u0003\u0002\u0002",
    "\u0002\u008d\u008e\u0003\u0002\u0002\u0002\u008e\u000b\u0003\u0002\u0002",
    "\u0002\u008f\u0092\u0005\"\u0012\u0002\u0090\u0092\u0007\u0010\u0002",
    "\u0002\u0091\u008f\u0003\u0002\u0002\u0002\u0091\u0090\u0003\u0002\u0002",
    "\u0002\u0092\r\u0003\u0002\u0002\u0002\u0093\u0095\t\b\u0002\u0002\u0094",
    "\u0096\u0005\"\u0012\u0002\u0095\u0094\u0003\u0002\u0002\u0002\u0095",
    "\u0096\u0003\u0002\u0002\u0002\u0096\u00a4\u0003\u0002\u0002\u0002\u0097",
    "\u0098\t\t\u0002\u0002\u0098\u009b\u0005\"\u0012\u0002\u0099\u009a\t",
    "\n\u0002\u0002\u009a\u009c\u0005\"\u0012\u0002\u009b\u0099\u0003\u0002",
    "\u0002\u0002\u009b\u009c\u0003\u0002\u0002\u0002\u009c\u00a4\u0003\u0002",
    "\u0002\u0002\u009d\u009e\t\n\u0002\u0002\u009e\u009f\u0005\"\u0012\u0002",
    "\u009f\u00a0\t\t\u0002\u0002\u00a0\u00a1\u0005\"\u0012\u0002\u00a1\u00a4",
    "\u0003\u0002\u0002\u0002\u00a2\u00a4\u0005\u0018\r\u0002\u00a3\u0093",
    "\u0003\u0002\u0002\u0002\u00a3\u0097\u0003\u0002\u0002\u0002\u00a3\u009d",
    "\u0003\u0002\u0002\u0002\u00a3\u00a2\u0003\u0002\u0002\u0002\u00a4\u000f",
    "\u0003\u0002\u0002\u0002\u00a5\u00a7\u0005\"\u0012\u0002\u00a6\u00a5",
    "\u0003\u0002\u0002\u0002\u00a6\u00a7\u0003\u0002\u0002\u0002\u00a7\u00a8",
    "\u0003\u0002\u0002\u0002\u00a8\u00a9\t\t\u0002\u0002\u00a9\u00ac\u0005",
    "\"\u0012\u0002\u00aa\u00ab\t\u000b\u0002\u0002\u00ab\u00ad\u0005\"\u0012",
    "\u0002\u00ac\u00aa\u0003\u0002\u0002\u0002\u00ac\u00ad\u0003\u0002\u0002",
    "\u0002\u00ad\u00af\u0003\u0002\u0002\u0002\u00ae\u00b0\u0005\u0018\r",
    "\u0002\u00af\u00ae\u0003\u0002\u0002\u0002\u00af\u00b0\u0003\u0002\u0002",
    "\u0002\u00b0\u0011\u0003\u0002\u0002\u0002\u00b1\u00b2\t\u0003\u0002",
    "\u0002\u00b2\u00b4\u0005\"\u0012\u0002\u00b3\u00b5\u0005\u0018\r\u0002",
    "\u00b4\u00b3\u0003\u0002\u0002\u0002\u00b4\u00b5\u0003\u0002\u0002\u0002",
    "\u00b5\u0013\u0003\u0002\u0002\u0002\u00b6\u00b7\t\f\u0002\u0002\u00b7",
    "\u00bb\u0005\"\u0012\u0002\u00b8\u00ba\u0005\u0016\f\u0002\u00b9\u00b8",
    "\u0003\u0002\u0002\u0002\u00ba\u00bd\u0003\u0002\u0002\u0002\u00bb\u00b9",
    "\u0003\u0002\u0002\u0002\u00bb\u00bc\u0003\u0002\u0002\u0002\u00bc\u0015",
    "\u0003\u0002\u0002\u0002\u00bd\u00bb\u0003\u0002\u0002\u0002\u00be\u00bf",
    "\t\r\u0002\u0002\u00bf\u00d0\u0005\"\u0012\u0002\u00c0\u00c1\t\n\u0002",
    "\u0002\u00c1\u00d0\u0005\"\u0012\u0002\u00c2\u00d0\t\u000e\u0002\u0002",
    "\u00c3\u00c8\u0007\u0006\u0002\u0002\u00c4\u00c6\u0005\"\u0012\u0002",
    "\u00c5\u00c4\u0003\u0002\u0002\u0002\u00c5\u00c6\u0003\u0002\u0002\u0002",
    "\u00c6\u00c7\u0003\u0002\u0002\u0002\u00c7\u00c9\t\u0007\u0002\u0002",
    "\u00c8\u00c5\u0003\u0002\u0002\u0002\u00c8\u00c9\u0003\u0002\u0002\u0002",
    "\u00c9\u00cc\u0003\u0002\u0002\u0002\u00ca\u00cb\t\u0005\u0002\u0002",
    "\u00cb\u00cd\u0005\"\u0012\u0002\u00cc\u00ca\u0003\u0002\u0002\u0002",
    "\u00cc\u00cd\u0003\u0002\u0002\u0002\u00cd\u00ce\u0003\u0002\u0002\u0002",
    "\u00ce\u00d0\u0007\u0007\u0002\u0002\u00cf\u00be\u0003\u0002\u0002\u0002",
    "\u00cf\u00c0\u0003\u0002\u0002\u0002\u00cf\u00c2\u0003\u0002\u0002\u0002",
    "\u00cf\u00c3\u0003\u0002\u0002\u0002\u00d0\u0017\u0003\u0002\u0002\u0002",
    "\u00d1\u00d2\t\u000f\u0002\u0002\u00d2\u00e5\u0005\"\u0012\u0002\u00d3",
    "\u00d4\t\u0010\u0002\u0002\u00d4\u00d7\u0005\"\u0012\u0002\u00d5\u00d6",
    "\t\u0011\u0002\u0002\u00d6\u00d8\u0005\"\u0012\u0002\u00d7\u00d5\u0003",
    "\u0002\u0002\u0002\u00d7\u00d8\u0003\u0002\u0002\u0002\u00d8\u00e5\u0003",
    "\u0002\u0002\u0002\u00d9\u00da\t\u0011\u0002\u0002\u00da\u00dd\u0005",
    "\"\u0012\u0002\u00db\u00dc\t\u0010\u0002\u0002\u00dc\u00de\u0005\"\u0012",
    "\u0002\u00dd\u00db\u0003\u0002\u0002\u0002\u00dd\u00de\u0003\u0002\u0002",
    "\u0002\u00de\u00e5\u0003\u0002\u0002\u0002\u00df\u00e0\t\u0012\u0002",
    "\u0002\u00e0\u00e2\u0005\"\u0012\u0002\u00e1\u00e3\t\u0005\u0002\u0002",
    "\u00e2\u00e1\u0003\u0002\u0002\u0002\u00e2\u00e3\u0003\u0002\u0002\u0002",
    "\u00e3\u00e5\u0003\u0002\u0002\u0002\u00e4\u00d1\u0003\u0002\u0002\u0002",
    "\u00e4\u00d3\u0003\u0002\u0002\u0002\u00e4\u00d9\u0003\u0002\u0002\u0002",
    "\u00e4\u00df\u0003\u0002\u0002\u0002\u00e5\u0019\u0003\u0002\u0002\u0002",
    "\u00e6\u00e7\t\u0005\u0002\u0002\u00e7\u00e8\u0005\b\u0005\u0002\u00e8",
    "\u001b\u0003\u0002\u0002\u0002\u00e9\u00eb\u0005\"\u0012\u0002\u00ea",
    "\u00e9\u0003\u0002\u0002\u0002\u00ea\u00eb\u0003\u0002\u0002\u0002\u00eb",
    "\u00ec\u0003\u0002\u0002\u0002\u00ec\u00ed\t\u0013\u0002\u0002\u00ed",
    "\u001d\u0003\u0002\u0002\u0002\u00ee\u00f0\u0005\"\u0012\u0002\u00ef",
    "\u00ee\u0003\u0002\u0002\u0002\u00ef\u00f0\u0003\u0002\u0002\u0002\u00f0",
    "\u00f1\u0003\u0002\u0002\u0002\u00f1\u00f2\t\u0014\u0002\u0002\u00f2",
    "\u001f\u0003\u0002\u0002\u0002\u00f3\u00f4\u0005\"\u0012\u0002\u00f4",
    "\u00f5\t\u000b\u0002\u0002\u00f5!\u0003\u0002\u0002\u0002\u00f6\u0100",
    "\u00079\u0002\u0002\u00f7\u0100\u0007=\u0002\u0002\u00f8\u00fa\u0007",
    "7\u0002\u0002\u00f9\u00fb\u0007:\u0002\u0002\u00fa\u00f9\u0003\u0002",
    "\u0002\u0002\u00fa\u00fb\u0003\u0002\u0002\u0002\u00fb\u00fc\u0003\u0002",
    "\u0002\u0002\u00fc\u00fd\u0005\b\u0005\u0002\u00fd\u00fe\u00078\u0002",
    "\u0002\u00fe\u0100\u0003\u0002\u0002\u0002\u00ff\u00f6\u0003\u0002\u0002",
    "\u0002\u00ff\u00f7\u0003\u0002\u0002\u0002\u00ff\u00f8\u0003\u0002\u0002",
    "\u0002\u0100#\u0003\u0002\u0002\u0002()-<EHLORVmx|\u007f\u0081\u0085",
    "\u008a\u008d\u0091\u0095\u009b\u00a3\u00a6\u00ac\u00af\u00b4\u00bb\u00c5",
    "\u00c8\u00cc\u00cf\u00d7\u00dd\u00e2\u00e4\u00ea\u00ef\u00fa\u00ff"].join("");


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.PredictionContextCache();

export default class R2Parser extends antlr4.Parser {

    static grammarFileName = "R2.g4";
    static literalNames = [ null, "';'", "'x'", "'X'", "'['", "']'", "'e'", 
                            "'E'", "'i'", "'I'", "':'", "':='", "'*'", "'/'", 
                            "'%'", "'--'", "'+'", "'-'", "'d'", "'D'", "'!'", 
                            "'k'", "'K'", "'kl'", "'KL'", "'adv'", "'dis'", 
                            "'s'", "'S'", "'f'", "'F'", "'w'", "'W'", "'p'", 
                            "'P'", "'c'", "'C'", "'h'", "'H'", "'tr'", "'TR'", 
                            "'t'", "'T'", "'r'", "'R'", "'tn'", "'TN'", 
                            "'dF'", "'df'", "'DF'", "'dC'", "'dc'", "'DC'", 
                            "'('", "')'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, "INT", 
                             "STRING", "WS", "FLAG", "VAR" ];
    static ruleNames = [ "commandElement", "statement", "batchElement", 
                         "expression", "genericRoll", "dieFacetsTerm", "genericRollSuffix", 
                         "savageWorldsRoll", "savageWorldsExtrasRoll", "swordWorldPowerRoll", 
                         "swordWorldPowerRollModifier", "targetNumberAndRaiseStep", 
                         "additiveModifier", "fudgeRoll", "carcosaRoll", 
                         "wegD6Roll", "term" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = R2Parser.ruleNames;
        this.literalNames = R2Parser.literalNames;
        this.symbolicNames = R2Parser.symbolicNames;
    }

    get atn() {
        return atn;
    }

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 3:
    	    		return this.expression_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    expression_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 0:
    			return this.precpred(this._ctx, 5);
    		case 1:
    			return this.precpred(this._ctx, 3);
    		case 2:
    			return this.precpred(this._ctx, 8);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };



	commandElement() {
	    let localctx = new CommandElementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, R2Parser.RULE_commandElement);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 34;
	        this.statement();
	        this.state = 39;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 35;
	                this.match(R2Parser.T__0);
	                this.state = 36;
	                this.statement(); 
	            }
	            this.state = 41;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
	        }

	        this.state = 43;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===R2Parser.T__0) {
	            this.state = 42;
	            this.match(R2Parser.T__0);
	        }

	        this.state = 45;
	        this.match(R2Parser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	statement() {
	    let localctx = new StatementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, R2Parser.RULE_statement);
	    var _la = 0; // Token type
	    try {
	        this.state = 77;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new RollOnceStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 47;
	            localctx.e = this.expression(0);
	            break;

	        case 2:
	            localctx = new RollTimesStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 48;
	            localctx.n = this.term();
	            this.state = 49;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__1 || _la===R2Parser.T__2)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 50;
	            localctx.e = this.expression(0);
	            break;

	        case 3:
	            localctx = new RollBatchTimesStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 52;
	            localctx.n = this.term();
	            this.state = 53;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__1 || _la===R2Parser.T__2)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 54;
	            this.match(R2Parser.T__3);
	            this.state = 58;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2Parser.T__5) | (1 << R2Parser.T__6) | (1 << R2Parser.T__15) | (1 << R2Parser.T__16) | (1 << R2Parser.T__17) | (1 << R2Parser.T__18) | (1 << R2Parser.T__26) | (1 << R2Parser.T__27))) !== 0) || ((((_la - 33)) & ~0x1f) == 0 && ((1 << (_la - 33)) & ((1 << (R2Parser.T__32 - 33)) | (1 << (R2Parser.T__33 - 33)) | (1 << (R2Parser.T__38 - 33)) | (1 << (R2Parser.T__39 - 33)) | (1 << (R2Parser.T__40 - 33)) | (1 << (R2Parser.T__41 - 33)) | (1 << (R2Parser.T__42 - 33)) | (1 << (R2Parser.T__43 - 33)) | (1 << (R2Parser.T__44 - 33)) | (1 << (R2Parser.T__45 - 33)) | (1 << (R2Parser.T__46 - 33)) | (1 << (R2Parser.T__47 - 33)) | (1 << (R2Parser.T__48 - 33)) | (1 << (R2Parser.T__49 - 33)) | (1 << (R2Parser.T__50 - 33)) | (1 << (R2Parser.T__51 - 33)) | (1 << (R2Parser.T__52 - 33)) | (1 << (R2Parser.INT - 33)) | (1 << (R2Parser.STRING - 33)) | (1 << (R2Parser.VAR - 33)))) !== 0)) {
	                this.state = 55;
	                this.batchElement();
	                this.state = 60;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 61;
	            this.match(R2Parser.T__4);
	            break;

	        case 4:
	            localctx = new RollSavageWorldsExtraStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 63;
	            localctx.n = this.term();
	            this.state = 64;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__5 || _la===R2Parser.T__6)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 65;
	            localctx.t1 = this.term();
	            this.state = 67;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(((((_la - 39)) & ~0x1f) == 0 && ((1 << (_la - 39)) & ((1 << (R2Parser.T__38 - 39)) | (1 << (R2Parser.T__39 - 39)) | (1 << (R2Parser.T__40 - 39)) | (1 << (R2Parser.T__41 - 39)) | (1 << (R2Parser.T__42 - 39)) | (1 << (R2Parser.T__43 - 39)) | (1 << (R2Parser.T__44 - 39)) | (1 << (R2Parser.T__45 - 39)))) !== 0)) {
	                this.state = 66;
	                this.targetNumberAndRaiseStep();
	            }

	            this.state = 70;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===R2Parser.T__15 || _la===R2Parser.T__16) {
	                this.state = 69;
	                this.additiveModifier();
	            }

	            break;

	        case 5:
	            localctx = new IronSwornRollStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 72;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__7 || _la===R2Parser.T__8)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 74;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===R2Parser.T__15 || _la===R2Parser.T__16) {
	                this.state = 73;
	                this.additiveModifier();
	            }

	            break;

	        case 6:
	            localctx = new FlagStmtContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 76;
	            localctx.flag = this.match(R2Parser.FLAG);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	batchElement() {
	    let localctx = new BatchElementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, R2Parser.RULE_batchElement);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 80;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===R2Parser.STRING) {
	            this.state = 79;
	            localctx.comment = this.match(R2Parser.STRING);
	        }

	        this.state = 82;
	        localctx.e = this.expression(0);
	        this.state = 84;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===R2Parser.T__0) {
	            this.state = 83;
	            this.match(R2Parser.T__0);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}

	expression(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new ExpressionContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 6;
	    this.enterRecursionRule(localctx, 6, R2Parser.RULE_expression, _p);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 107;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,9,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new GenericRollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;

	            this.state = 87;
	            this.genericRoll();
	            break;

	        case 2:
	            localctx = new SavageWorldsRollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 88;
	            this.savageWorldsRoll();
	            break;

	        case 3:
	            localctx = new SavageWorldsExtrasRollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 89;
	            this.savageWorldsExtrasRoll();
	            break;

	        case 4:
	            localctx = new FudgeRollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 90;
	            this.fudgeRoll();
	            break;

	        case 5:
	            localctx = new CarcosaRollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 91;
	            this.carcosaRoll();
	            break;

	        case 6:
	            localctx = new WegD6RollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 92;
	            this.wegD6Roll();
	            break;

	        case 7:
	            localctx = new SwordWorldPowerRollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 93;
	            this.swordWorldPowerRoll();
	            break;

	        case 8:
	            localctx = new TargetNumberAndRaiseStepExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 94;
	            this.targetNumberAndRaiseStep();
	            this.state = 95;
	            this.match(R2Parser.T__9);
	            this.state = 96;
	            localctx.e1 = this.expression(7);
	            break;

	        case 9:
	            localctx = new AssignExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 98;
	            localctx.v = this.match(R2Parser.VAR);
	            this.state = 99;
	            this.match(R2Parser.T__10);
	            this.state = 100;
	            localctx.e1 = this.expression(6);
	            break;

	        case 10:
	            localctx = new GygaxRangeRollExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 101;
	            localctx.g0 = this.match(R2Parser.INT);
	            this.state = 102;
	            this.match(R2Parser.T__14);
	            this.state = 103;
	            localctx.g1 = this.match(R2Parser.INT);
	            break;

	        case 11:
	            localctx = new PrefixExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 104;
	            localctx.op = this._input.LT(1);
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__15 || _la===R2Parser.T__16)) {
	                localctx.op = this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 105;
	            localctx.e1 = this.expression(2);
	            break;

	        case 12:
	            localctx = new TermExprContext(this, localctx);
	            this._ctx = localctx;
	            _prevctx = localctx;
	            this.state = 106;
	            localctx.t = this.term();
	            break;

	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 127;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,13,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                this.state = 125;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
	                switch(la_) {
	                case 1:
	                    localctx = new InfixExpr1Context(this, new ExpressionContext(this, _parentctx, _parentState));
	                    localctx.e1 = _prevctx;
	                    this.pushNewRecursionContext(localctx, _startState, R2Parser.RULE_expression);
	                    this.state = 109;
	                    if (!( this.precpred(this._ctx, 5))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
	                    }
	                    this.state = 110;
	                    localctx.op = this._input.LT(1);
	                    _la = this._input.LA(1);
	                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2Parser.T__11) | (1 << R2Parser.T__12) | (1 << R2Parser.T__13))) !== 0))) {
	                        localctx.op = this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 111;
	                    localctx.e2 = this.expression(6);
	                    break;

	                case 2:
	                    localctx = new InfixExpr2Context(this, new ExpressionContext(this, _parentctx, _parentState));
	                    localctx.e1 = _prevctx;
	                    this.pushNewRecursionContext(localctx, _startState, R2Parser.RULE_expression);
	                    this.state = 112;
	                    if (!( this.precpred(this._ctx, 3))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
	                    }
	                    this.state = 113;
	                    localctx.op = this._input.LT(1);
	                    _la = this._input.LA(1);
	                    if(!(_la===R2Parser.T__15 || _la===R2Parser.T__16)) {
	                        localctx.op = this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 114;
	                    localctx.e2 = this.expression(4);
	                    break;

	                case 3:
	                    localctx = new BoundedExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
	                    localctx.e1 = _prevctx;
	                    this.pushNewRecursionContext(localctx, _startState, R2Parser.RULE_expression);
	                    this.state = 115;
	                    if (!( this.precpred(this._ctx, 8))) {
	                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
	                    }
	                    this.state = 116;
	                    this.match(R2Parser.T__3);
	                    this.state = 118;
	                    this._errHandler.sync(this);
	                    _la = this._input.LA(1);
	                    if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2Parser.T__5) | (1 << R2Parser.T__6) | (1 << R2Parser.T__15) | (1 << R2Parser.T__16) | (1 << R2Parser.T__17) | (1 << R2Parser.T__18) | (1 << R2Parser.T__26) | (1 << R2Parser.T__27))) !== 0) || ((((_la - 33)) & ~0x1f) == 0 && ((1 << (_la - 33)) & ((1 << (R2Parser.T__32 - 33)) | (1 << (R2Parser.T__33 - 33)) | (1 << (R2Parser.T__38 - 33)) | (1 << (R2Parser.T__39 - 33)) | (1 << (R2Parser.T__40 - 33)) | (1 << (R2Parser.T__41 - 33)) | (1 << (R2Parser.T__42 - 33)) | (1 << (R2Parser.T__43 - 33)) | (1 << (R2Parser.T__44 - 33)) | (1 << (R2Parser.T__45 - 33)) | (1 << (R2Parser.T__46 - 33)) | (1 << (R2Parser.T__47 - 33)) | (1 << (R2Parser.T__48 - 33)) | (1 << (R2Parser.T__49 - 33)) | (1 << (R2Parser.T__50 - 33)) | (1 << (R2Parser.T__51 - 33)) | (1 << (R2Parser.T__52 - 33)) | (1 << (R2Parser.INT - 33)) | (1 << (R2Parser.VAR - 33)))) !== 0)) {
	                        this.state = 117;
	                        localctx.e2 = this.expression(0);
	                    }

	                    this.state = 120;
	                    this.match(R2Parser.T__9);
	                    this.state = 122;
	                    this._errHandler.sync(this);
	                    _la = this._input.LA(1);
	                    if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2Parser.T__5) | (1 << R2Parser.T__6) | (1 << R2Parser.T__15) | (1 << R2Parser.T__16) | (1 << R2Parser.T__17) | (1 << R2Parser.T__18) | (1 << R2Parser.T__26) | (1 << R2Parser.T__27))) !== 0) || ((((_la - 33)) & ~0x1f) == 0 && ((1 << (_la - 33)) & ((1 << (R2Parser.T__32 - 33)) | (1 << (R2Parser.T__33 - 33)) | (1 << (R2Parser.T__38 - 33)) | (1 << (R2Parser.T__39 - 33)) | (1 << (R2Parser.T__40 - 33)) | (1 << (R2Parser.T__41 - 33)) | (1 << (R2Parser.T__42 - 33)) | (1 << (R2Parser.T__43 - 33)) | (1 << (R2Parser.T__44 - 33)) | (1 << (R2Parser.T__45 - 33)) | (1 << (R2Parser.T__46 - 33)) | (1 << (R2Parser.T__47 - 33)) | (1 << (R2Parser.T__48 - 33)) | (1 << (R2Parser.T__49 - 33)) | (1 << (R2Parser.T__50 - 33)) | (1 << (R2Parser.T__51 - 33)) | (1 << (R2Parser.T__52 - 33)) | (1 << (R2Parser.INT - 33)) | (1 << (R2Parser.VAR - 33)))) !== 0)) {
	                        this.state = 121;
	                        localctx.e3 = this.expression(0);
	                    }

	                    this.state = 124;
	                    this.match(R2Parser.T__4);
	                    break;

	                } 
	            }
	            this.state = 129;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,13,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}


	genericRoll() {
	    let localctx = new GenericRollContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, R2Parser.RULE_genericRoll);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 131;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(((((_la - 53)) & ~0x1f) == 0 && ((1 << (_la - 53)) & ((1 << (R2Parser.T__52 - 53)) | (1 << (R2Parser.INT - 53)) | (1 << (R2Parser.VAR - 53)))) !== 0)) {
	            this.state = 130;
	            localctx.t1 = this.term();
	        }

	        this.state = 133;
	        _la = this._input.LA(1);
	        if(!(_la===R2Parser.T__17 || _la===R2Parser.T__18)) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }

	        this.state = 134;
	        localctx.t2 = this.dieFacetsTerm();
	        this.state = 136;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
	        if(la_===1) {
	            this.state = 135;
	            localctx.excl = this.match(R2Parser.T__19);

	        }
	        this.state = 139;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,16,this._ctx);
	        if(la_===1) {
	            this.state = 138;
	            this.genericRollSuffix();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	dieFacetsTerm() {
	    let localctx = new DieFacetsTermContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, R2Parser.RULE_dieFacetsTerm);
	    try {
	        this.state = 143;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case R2Parser.T__52:
	        case R2Parser.INT:
	        case R2Parser.VAR:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 141;
	            this.term();
	            break;
	        case R2Parser.T__13:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 142;
	            this.match(R2Parser.T__13);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	genericRollSuffix() {
	    let localctx = new GenericRollSuffixContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, R2Parser.RULE_genericRollSuffix);
	    var _la = 0; // Token type
	    try {
	        this.state = 161;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case R2Parser.T__20:
	        case R2Parser.T__21:
	        case R2Parser.T__22:
	        case R2Parser.T__23:
	        case R2Parser.T__24:
	        case R2Parser.T__25:
	            localctx = new RollAndKeepSuffixContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 145;
	            localctx.op = this._input.LT(1);
	            _la = this._input.LA(1);
	            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2Parser.T__20) | (1 << R2Parser.T__21) | (1 << R2Parser.T__22) | (1 << R2Parser.T__23) | (1 << R2Parser.T__24) | (1 << R2Parser.T__25))) !== 0))) {
	                localctx.op = this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 147;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,18,this._ctx);
	            if(la_===1) {
	                this.state = 146;
	                localctx.n = this.term();

	            }
	            break;
	        case R2Parser.T__26:
	        case R2Parser.T__27:
	            localctx = new SuccessOrFailSuffix1Context(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 149;
	            localctx.sop = this._input.LT(1);
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__26 || _la===R2Parser.T__27)) {
	                localctx.sop = this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 150;
	            localctx.sn = this.term();
	            this.state = 153;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,19,this._ctx);
	            if(la_===1) {
	                this.state = 151;
	                localctx.fop = this._input.LT(1);
	                _la = this._input.LA(1);
	                if(!(_la===R2Parser.T__28 || _la===R2Parser.T__29)) {
	                    localctx.fop = this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 152;
	                localctx.fn = this.term();

	            }
	            break;
	        case R2Parser.T__28:
	        case R2Parser.T__29:
	            localctx = new SuccessOrFailSuffix2Context(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 155;
	            localctx.fop = this._input.LT(1);
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__28 || _la===R2Parser.T__29)) {
	                localctx.fop = this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 156;
	            localctx.fn = this.term();
	            this.state = 157;
	            localctx.sop = this._input.LT(1);
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__26 || _la===R2Parser.T__27)) {
	                localctx.sop = this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 158;
	            localctx.sn = this.term();
	            break;
	        case R2Parser.T__38:
	        case R2Parser.T__39:
	        case R2Parser.T__40:
	        case R2Parser.T__41:
	        case R2Parser.T__42:
	        case R2Parser.T__43:
	        case R2Parser.T__44:
	        case R2Parser.T__45:
	            localctx = new TargetNumberAndRaiseStepSuffixContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 160;
	            this.targetNumberAndRaiseStep();
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	savageWorldsRoll() {
	    let localctx = new SavageWorldsRollContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, R2Parser.RULE_savageWorldsRoll);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 164;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(((((_la - 53)) & ~0x1f) == 0 && ((1 << (_la - 53)) & ((1 << (R2Parser.T__52 - 53)) | (1 << (R2Parser.INT - 53)) | (1 << (R2Parser.VAR - 53)))) !== 0)) {
	            this.state = 163;
	            localctx.t1 = this.term();
	        }

	        this.state = 166;
	        _la = this._input.LA(1);
	        if(!(_la===R2Parser.T__26 || _la===R2Parser.T__27)) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	        this.state = 167;
	        localctx.t2 = this.term();
	        this.state = 170;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,22,this._ctx);
	        if(la_===1) {
	            this.state = 168;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__30 || _la===R2Parser.T__31)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 169;
	            localctx.t3 = this.term();

	        }
	        this.state = 173;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,23,this._ctx);
	        if(la_===1) {
	            this.state = 172;
	            this.targetNumberAndRaiseStep();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	savageWorldsExtrasRoll() {
	    let localctx = new SavageWorldsExtrasRollContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, R2Parser.RULE_savageWorldsExtrasRoll);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 175;
	        _la = this._input.LA(1);
	        if(!(_la===R2Parser.T__5 || _la===R2Parser.T__6)) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	        this.state = 176;
	        localctx.t1 = this.term();
	        this.state = 178;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,24,this._ctx);
	        if(la_===1) {
	            this.state = 177;
	            this.targetNumberAndRaiseStep();

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	swordWorldPowerRoll() {
	    let localctx = new SwordWorldPowerRollContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, R2Parser.RULE_swordWorldPowerRoll);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 180;
	        _la = this._input.LA(1);
	        if(!(_la===R2Parser.T__32 || _la===R2Parser.T__33)) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	        this.state = 181;
	        localctx.tp = this.term();
	        this.state = 185;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,25,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 182;
	                this.swordWorldPowerRollModifier(); 
	            }
	            this.state = 187;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,25,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	swordWorldPowerRollModifier() {
	    let localctx = new SwordWorldPowerRollModifierContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, R2Parser.RULE_swordWorldPowerRollModifier);
	    var _la = 0; // Token type
	    try {
	        this.state = 205;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case R2Parser.T__34:
	        case R2Parser.T__35:
	            localctx = new SwordWorldCriticalModifierContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 188;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__34 || _la===R2Parser.T__35)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 189;
	            localctx.tc = this.term();
	            break;
	        case R2Parser.T__28:
	        case R2Parser.T__29:
	            localctx = new SwordWorldAutoFailModifierContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 190;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__28 || _la===R2Parser.T__29)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 191;
	            localctx.tf = this.term();
	            break;
	        case R2Parser.T__36:
	        case R2Parser.T__37:
	            localctx = new SwordWorldHumanSwordGraceModifierContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 192;
	            localctx.dop = this._input.LT(1);
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__36 || _la===R2Parser.T__37)) {
	                localctx.dop = this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            break;
	        case R2Parser.T__3:
	            localctx = new SwordWorldRollModifierContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 193;
	            this.match(R2Parser.T__3);
	            this.state = 198;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===R2Parser.T__17 || _la===R2Parser.T__18 || ((((_la - 53)) & ~0x1f) == 0 && ((1 << (_la - 53)) & ((1 << (R2Parser.T__52 - 53)) | (1 << (R2Parser.INT - 53)) | (1 << (R2Parser.VAR - 53)))) !== 0)) {
	                this.state = 195;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	                if(((((_la - 53)) & ~0x1f) == 0 && ((1 << (_la - 53)) & ((1 << (R2Parser.T__52 - 53)) | (1 << (R2Parser.INT - 53)) | (1 << (R2Parser.VAR - 53)))) !== 0)) {
	                    this.state = 194;
	                    localctx.td = this.term();
	                }

	                this.state = 197;
	                localctx.dop = this._input.LT(1);
	                _la = this._input.LA(1);
	                if(!(_la===R2Parser.T__17 || _la===R2Parser.T__18)) {
	                    localctx.dop = this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	            }

	            this.state = 202;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===R2Parser.T__15 || _la===R2Parser.T__16) {
	                this.state = 200;
	                localctx.mop = this._input.LT(1);
	                _la = this._input.LA(1);
	                if(!(_la===R2Parser.T__15 || _la===R2Parser.T__16)) {
	                    localctx.mop = this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 201;
	                localctx.tm = this.term();
	            }

	            this.state = 204;
	            this.match(R2Parser.T__4);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	targetNumberAndRaiseStep() {
	    let localctx = new TargetNumberAndRaiseStepContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, R2Parser.RULE_targetNumberAndRaiseStep);
	    var _la = 0; // Token type
	    try {
	        this.state = 226;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case R2Parser.T__38:
	        case R2Parser.T__39:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 207;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__38 || _la===R2Parser.T__39)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 208;
	            localctx.tnr = this.term();
	            break;
	        case R2Parser.T__40:
	        case R2Parser.T__41:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 209;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__40 || _la===R2Parser.T__41)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 210;
	            localctx.tt = this.term();
	            this.state = 213;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,30,this._ctx);
	            if(la_===1) {
	                this.state = 211;
	                _la = this._input.LA(1);
	                if(!(_la===R2Parser.T__42 || _la===R2Parser.T__43)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 212;
	                localctx.tr = this.term();

	            }
	            break;
	        case R2Parser.T__42:
	        case R2Parser.T__43:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 215;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__42 || _la===R2Parser.T__43)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 216;
	            localctx.tr = this.term();
	            this.state = 219;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,31,this._ctx);
	            if(la_===1) {
	                this.state = 217;
	                _la = this._input.LA(1);
	                if(!(_la===R2Parser.T__40 || _la===R2Parser.T__41)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 218;
	                localctx.tt = this.term();

	            }
	            break;
	        case R2Parser.T__44:
	        case R2Parser.T__45:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 221;
	            _la = this._input.LA(1);
	            if(!(_la===R2Parser.T__44 || _la===R2Parser.T__45)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 222;
	            localctx.tgtn = this.term();
	            this.state = 224;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,32,this._ctx);
	            if(la_===1) {
	                this.state = 223;
	                _la = this._input.LA(1);
	                if(!(_la===R2Parser.T__15 || _la===R2Parser.T__16)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }

	            }
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	additiveModifier() {
	    let localctx = new AdditiveModifierContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, R2Parser.RULE_additiveModifier);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 228;
	        localctx.op = this._input.LT(1);
	        _la = this._input.LA(1);
	        if(!(_la===R2Parser.T__15 || _la===R2Parser.T__16)) {
	            localctx.op = this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	        this.state = 229;
	        localctx.em = this.expression(0);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	fudgeRoll() {
	    let localctx = new FudgeRollContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 26, R2Parser.RULE_fudgeRoll);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 232;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(((((_la - 53)) & ~0x1f) == 0 && ((1 << (_la - 53)) & ((1 << (R2Parser.T__52 - 53)) | (1 << (R2Parser.INT - 53)) | (1 << (R2Parser.VAR - 53)))) !== 0)) {
	            this.state = 231;
	            localctx.t = this.term();
	        }

	        this.state = 234;
	        _la = this._input.LA(1);
	        if(!(((((_la - 47)) & ~0x1f) == 0 && ((1 << (_la - 47)) & ((1 << (R2Parser.T__46 - 47)) | (1 << (R2Parser.T__47 - 47)) | (1 << (R2Parser.T__48 - 47)))) !== 0))) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	carcosaRoll() {
	    let localctx = new CarcosaRollContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 28, R2Parser.RULE_carcosaRoll);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 237;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(((((_la - 53)) & ~0x1f) == 0 && ((1 << (_la - 53)) & ((1 << (R2Parser.T__52 - 53)) | (1 << (R2Parser.INT - 53)) | (1 << (R2Parser.VAR - 53)))) !== 0)) {
	            this.state = 236;
	            localctx.t = this.term();
	        }

	        this.state = 239;
	        _la = this._input.LA(1);
	        if(!(((((_la - 50)) & ~0x1f) == 0 && ((1 << (_la - 50)) & ((1 << (R2Parser.T__49 - 50)) | (1 << (R2Parser.T__50 - 50)) | (1 << (R2Parser.T__51 - 50)))) !== 0))) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	wegD6Roll() {
	    let localctx = new WegD6RollContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 30, R2Parser.RULE_wegD6Roll);
	    var _la = 0; // Token type
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 241;
	        localctx.t = this.term();
	        this.state = 242;
	        _la = this._input.LA(1);
	        if(!(_la===R2Parser.T__30 || _la===R2Parser.T__31)) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	term() {
	    let localctx = new TermContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 32, R2Parser.RULE_term);
	    var _la = 0; // Token type
	    try {
	        this.state = 253;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case R2Parser.INT:
	            localctx = new IntTermContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 244;
	            localctx.i = this.match(R2Parser.INT);
	            break;
	        case R2Parser.VAR:
	            localctx = new VarTermContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 245;
	            localctx.v = this.match(R2Parser.VAR);
	            break;
	        case R2Parser.T__52:
	            localctx = new ExprTermContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 246;
	            this.match(R2Parser.T__52);
	            this.state = 248;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===R2Parser.STRING) {
	                this.state = 247;
	                localctx.comment = this.match(R2Parser.STRING);
	            }

	            this.state = 250;
	            localctx.e = this.expression(0);
	            this.state = 251;
	            this.match(R2Parser.T__53);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

R2Parser.EOF = antlr4.Token.EOF;
R2Parser.T__0 = 1;
R2Parser.T__1 = 2;
R2Parser.T__2 = 3;
R2Parser.T__3 = 4;
R2Parser.T__4 = 5;
R2Parser.T__5 = 6;
R2Parser.T__6 = 7;
R2Parser.T__7 = 8;
R2Parser.T__8 = 9;
R2Parser.T__9 = 10;
R2Parser.T__10 = 11;
R2Parser.T__11 = 12;
R2Parser.T__12 = 13;
R2Parser.T__13 = 14;
R2Parser.T__14 = 15;
R2Parser.T__15 = 16;
R2Parser.T__16 = 17;
R2Parser.T__17 = 18;
R2Parser.T__18 = 19;
R2Parser.T__19 = 20;
R2Parser.T__20 = 21;
R2Parser.T__21 = 22;
R2Parser.T__22 = 23;
R2Parser.T__23 = 24;
R2Parser.T__24 = 25;
R2Parser.T__25 = 26;
R2Parser.T__26 = 27;
R2Parser.T__27 = 28;
R2Parser.T__28 = 29;
R2Parser.T__29 = 30;
R2Parser.T__30 = 31;
R2Parser.T__31 = 32;
R2Parser.T__32 = 33;
R2Parser.T__33 = 34;
R2Parser.T__34 = 35;
R2Parser.T__35 = 36;
R2Parser.T__36 = 37;
R2Parser.T__37 = 38;
R2Parser.T__38 = 39;
R2Parser.T__39 = 40;
R2Parser.T__40 = 41;
R2Parser.T__41 = 42;
R2Parser.T__42 = 43;
R2Parser.T__43 = 44;
R2Parser.T__44 = 45;
R2Parser.T__45 = 46;
R2Parser.T__46 = 47;
R2Parser.T__47 = 48;
R2Parser.T__48 = 49;
R2Parser.T__49 = 50;
R2Parser.T__50 = 51;
R2Parser.T__51 = 52;
R2Parser.T__52 = 53;
R2Parser.T__53 = 54;
R2Parser.INT = 55;
R2Parser.STRING = 56;
R2Parser.WS = 57;
R2Parser.FLAG = 58;
R2Parser.VAR = 59;

R2Parser.RULE_commandElement = 0;
R2Parser.RULE_statement = 1;
R2Parser.RULE_batchElement = 2;
R2Parser.RULE_expression = 3;
R2Parser.RULE_genericRoll = 4;
R2Parser.RULE_dieFacetsTerm = 5;
R2Parser.RULE_genericRollSuffix = 6;
R2Parser.RULE_savageWorldsRoll = 7;
R2Parser.RULE_savageWorldsExtrasRoll = 8;
R2Parser.RULE_swordWorldPowerRoll = 9;
R2Parser.RULE_swordWorldPowerRollModifier = 10;
R2Parser.RULE_targetNumberAndRaiseStep = 11;
R2Parser.RULE_additiveModifier = 12;
R2Parser.RULE_fudgeRoll = 13;
R2Parser.RULE_carcosaRoll = 14;
R2Parser.RULE_wegD6Roll = 15;
R2Parser.RULE_term = 16;

class CommandElementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_commandElement;
    }

	statement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementContext);
	    } else {
	        return this.getTypedRuleContext(StatementContext,i);
	    }
	};

	EOF() {
	    return this.getToken(R2Parser.EOF, 0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterCommandElement(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitCommandElement(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitCommandElement(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class StatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_statement;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class RollTimesStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        this.n = null; // TermContext;
        this.e = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterRollTimesStmt(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitRollTimesStmt(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitRollTimesStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.RollTimesStmtContext = RollTimesStmtContext;

class RollBatchTimesStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        this.n = null; // TermContext;
        super.copyFrom(ctx);
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	batchElement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(BatchElementContext);
	    } else {
	        return this.getTypedRuleContext(BatchElementContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterRollBatchTimesStmt(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitRollBatchTimesStmt(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitRollBatchTimesStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.RollBatchTimesStmtContext = RollBatchTimesStmtContext;

class IronSwornRollStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	additiveModifier() {
	    return this.getTypedRuleContext(AdditiveModifierContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterIronSwornRollStmt(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitIronSwornRollStmt(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitIronSwornRollStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.IronSwornRollStmtContext = IronSwornRollStmtContext;

class FlagStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        this.flag = null; // Token;
        super.copyFrom(ctx);
    }

	FLAG() {
	    return this.getToken(R2Parser.FLAG, 0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterFlagStmt(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitFlagStmt(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitFlagStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.FlagStmtContext = FlagStmtContext;

class RollOnceStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        this.e = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterRollOnceStmt(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitRollOnceStmt(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitRollOnceStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.RollOnceStmtContext = RollOnceStmtContext;

class RollSavageWorldsExtraStmtContext extends StatementContext {

    constructor(parser, ctx) {
        super(parser);
        this.n = null; // TermContext;
        this.t1 = null; // TermContext;
        super.copyFrom(ctx);
    }

	term = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(TermContext);
	    } else {
	        return this.getTypedRuleContext(TermContext,i);
	    }
	};

	targetNumberAndRaiseStep() {
	    return this.getTypedRuleContext(TargetNumberAndRaiseStepContext,0);
	};

	additiveModifier() {
	    return this.getTypedRuleContext(AdditiveModifierContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterRollSavageWorldsExtraStmt(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitRollSavageWorldsExtraStmt(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitRollSavageWorldsExtraStmt(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.RollSavageWorldsExtraStmtContext = RollSavageWorldsExtraStmtContext;

class BatchElementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_batchElement;
        this.comment = null; // Token
        this.e = null; // ExpressionContext
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	STRING() {
	    return this.getToken(R2Parser.STRING, 0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterBatchElement(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitBatchElement(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitBatchElement(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ExpressionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_expression;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class TermExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.t = null; // TermContext;
        super.copyFrom(ctx);
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterTermExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitTermExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitTermExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.TermExprContext = TermExprContext;

class SavageWorldsRollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	savageWorldsRoll() {
	    return this.getTypedRuleContext(SavageWorldsRollContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSavageWorldsRollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSavageWorldsRollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSavageWorldsRollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SavageWorldsRollExprContext = SavageWorldsRollExprContext;

class SwordWorldPowerRollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	swordWorldPowerRoll() {
	    return this.getTypedRuleContext(SwordWorldPowerRollContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSwordWorldPowerRollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSwordWorldPowerRollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSwordWorldPowerRollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SwordWorldPowerRollExprContext = SwordWorldPowerRollExprContext;

class InfixExpr2Context extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.e1 = null; // ExpressionContext;
        this.op = null; // Token;
        this.e2 = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterInfixExpr2(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitInfixExpr2(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitInfixExpr2(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.InfixExpr2Context = InfixExpr2Context;

class InfixExpr1Context extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.e1 = null; // ExpressionContext;
        this.op = null; // Token;
        this.e2 = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterInfixExpr1(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitInfixExpr1(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitInfixExpr1(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.InfixExpr1Context = InfixExpr1Context;

class TargetNumberAndRaiseStepExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.e1 = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	targetNumberAndRaiseStep() {
	    return this.getTypedRuleContext(TargetNumberAndRaiseStepContext,0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterTargetNumberAndRaiseStepExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitTargetNumberAndRaiseStepExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitTargetNumberAndRaiseStepExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.TargetNumberAndRaiseStepExprContext = TargetNumberAndRaiseStepExprContext;

class CarcosaRollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	carcosaRoll() {
	    return this.getTypedRuleContext(CarcosaRollContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterCarcosaRollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitCarcosaRollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitCarcosaRollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.CarcosaRollExprContext = CarcosaRollExprContext;

class SavageWorldsExtrasRollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	savageWorldsExtrasRoll() {
	    return this.getTypedRuleContext(SavageWorldsExtrasRollContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSavageWorldsExtrasRollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSavageWorldsExtrasRollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSavageWorldsExtrasRollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SavageWorldsExtrasRollExprContext = SavageWorldsExtrasRollExprContext;

class AssignExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.v = null; // Token;
        this.e1 = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	VAR() {
	    return this.getToken(R2Parser.VAR, 0);
	};

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterAssignExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitAssignExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitAssignExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.AssignExprContext = AssignExprContext;

class PrefixExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.op = null; // Token;
        this.e1 = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterPrefixExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitPrefixExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitPrefixExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.PrefixExprContext = PrefixExprContext;

class BoundedExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.e1 = null; // ExpressionContext;
        this.e2 = null; // ExpressionContext;
        this.e3 = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	expression = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ExpressionContext);
	    } else {
	        return this.getTypedRuleContext(ExpressionContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterBoundedExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitBoundedExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitBoundedExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.BoundedExprContext = BoundedExprContext;

class GygaxRangeRollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        this.g0 = null; // Token;
        this.g1 = null; // Token;
        super.copyFrom(ctx);
    }

	INT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(R2Parser.INT);
	    } else {
	        return this.getToken(R2Parser.INT, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterGygaxRangeRollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitGygaxRangeRollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitGygaxRangeRollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.GygaxRangeRollExprContext = GygaxRangeRollExprContext;

class GenericRollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	genericRoll() {
	    return this.getTypedRuleContext(GenericRollContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterGenericRollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitGenericRollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitGenericRollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.GenericRollExprContext = GenericRollExprContext;

class WegD6RollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	wegD6Roll() {
	    return this.getTypedRuleContext(WegD6RollContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterWegD6RollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitWegD6RollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitWegD6RollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.WegD6RollExprContext = WegD6RollExprContext;

class FudgeRollExprContext extends ExpressionContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	fudgeRoll() {
	    return this.getTypedRuleContext(FudgeRollContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterFudgeRollExpr(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitFudgeRollExpr(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitFudgeRollExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.FudgeRollExprContext = FudgeRollExprContext;

class GenericRollContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_genericRoll;
        this.t1 = null; // TermContext
        this.t2 = null; // DieFacetsTermContext
        this.excl = null; // Token
    }

	dieFacetsTerm() {
	    return this.getTypedRuleContext(DieFacetsTermContext,0);
	};

	genericRollSuffix() {
	    return this.getTypedRuleContext(GenericRollSuffixContext,0);
	};

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterGenericRoll(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitGenericRoll(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitGenericRoll(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class DieFacetsTermContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_dieFacetsTerm;
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterDieFacetsTerm(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitDieFacetsTerm(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitDieFacetsTerm(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class GenericRollSuffixContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_genericRollSuffix;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class TargetNumberAndRaiseStepSuffixContext extends GenericRollSuffixContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	targetNumberAndRaiseStep() {
	    return this.getTypedRuleContext(TargetNumberAndRaiseStepContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterTargetNumberAndRaiseStepSuffix(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitTargetNumberAndRaiseStepSuffix(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitTargetNumberAndRaiseStepSuffix(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.TargetNumberAndRaiseStepSuffixContext = TargetNumberAndRaiseStepSuffixContext;

class RollAndKeepSuffixContext extends GenericRollSuffixContext {

    constructor(parser, ctx) {
        super(parser);
        this.op = null; // Token;
        this.n = null; // TermContext;
        super.copyFrom(ctx);
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterRollAndKeepSuffix(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitRollAndKeepSuffix(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitRollAndKeepSuffix(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.RollAndKeepSuffixContext = RollAndKeepSuffixContext;

class SuccessOrFailSuffix1Context extends GenericRollSuffixContext {

    constructor(parser, ctx) {
        super(parser);
        this.sop = null; // Token;
        this.sn = null; // TermContext;
        this.fop = null; // Token;
        this.fn = null; // TermContext;
        super.copyFrom(ctx);
    }

	term = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(TermContext);
	    } else {
	        return this.getTypedRuleContext(TermContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSuccessOrFailSuffix1(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSuccessOrFailSuffix1(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSuccessOrFailSuffix1(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SuccessOrFailSuffix1Context = SuccessOrFailSuffix1Context;

class SuccessOrFailSuffix2Context extends GenericRollSuffixContext {

    constructor(parser, ctx) {
        super(parser);
        this.fop = null; // Token;
        this.fn = null; // TermContext;
        this.sop = null; // Token;
        this.sn = null; // TermContext;
        super.copyFrom(ctx);
    }

	term = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(TermContext);
	    } else {
	        return this.getTypedRuleContext(TermContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSuccessOrFailSuffix2(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSuccessOrFailSuffix2(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSuccessOrFailSuffix2(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SuccessOrFailSuffix2Context = SuccessOrFailSuffix2Context;

class SavageWorldsRollContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_savageWorldsRoll;
        this.t1 = null; // TermContext
        this.t2 = null; // TermContext
        this.t3 = null; // TermContext
    }

	term = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(TermContext);
	    } else {
	        return this.getTypedRuleContext(TermContext,i);
	    }
	};

	targetNumberAndRaiseStep() {
	    return this.getTypedRuleContext(TargetNumberAndRaiseStepContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSavageWorldsRoll(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSavageWorldsRoll(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSavageWorldsRoll(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class SavageWorldsExtrasRollContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_savageWorldsExtrasRoll;
        this.t1 = null; // TermContext
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	targetNumberAndRaiseStep() {
	    return this.getTypedRuleContext(TargetNumberAndRaiseStepContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSavageWorldsExtrasRoll(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSavageWorldsExtrasRoll(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSavageWorldsExtrasRoll(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class SwordWorldPowerRollContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_swordWorldPowerRoll;
        this.tp = null; // TermContext
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	swordWorldPowerRollModifier = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(SwordWorldPowerRollModifierContext);
	    } else {
	        return this.getTypedRuleContext(SwordWorldPowerRollModifierContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSwordWorldPowerRoll(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSwordWorldPowerRoll(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSwordWorldPowerRoll(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class SwordWorldPowerRollModifierContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_swordWorldPowerRollModifier;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class SwordWorldHumanSwordGraceModifierContext extends SwordWorldPowerRollModifierContext {

    constructor(parser, ctx) {
        super(parser);
        this.dop = null; // Token;
        super.copyFrom(ctx);
    }


	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSwordWorldHumanSwordGraceModifier(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSwordWorldHumanSwordGraceModifier(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSwordWorldHumanSwordGraceModifier(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SwordWorldHumanSwordGraceModifierContext = SwordWorldHumanSwordGraceModifierContext;

class SwordWorldCriticalModifierContext extends SwordWorldPowerRollModifierContext {

    constructor(parser, ctx) {
        super(parser);
        this.tc = null; // TermContext;
        super.copyFrom(ctx);
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSwordWorldCriticalModifier(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSwordWorldCriticalModifier(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSwordWorldCriticalModifier(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SwordWorldCriticalModifierContext = SwordWorldCriticalModifierContext;

class SwordWorldAutoFailModifierContext extends SwordWorldPowerRollModifierContext {

    constructor(parser, ctx) {
        super(parser);
        this.tf = null; // TermContext;
        super.copyFrom(ctx);
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSwordWorldAutoFailModifier(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSwordWorldAutoFailModifier(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSwordWorldAutoFailModifier(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SwordWorldAutoFailModifierContext = SwordWorldAutoFailModifierContext;

class SwordWorldRollModifierContext extends SwordWorldPowerRollModifierContext {

    constructor(parser, ctx) {
        super(parser);
        this.td = null; // TermContext;
        this.dop = null; // Token;
        this.mop = null; // Token;
        this.tm = null; // TermContext;
        super.copyFrom(ctx);
    }

	term = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(TermContext);
	    } else {
	        return this.getTypedRuleContext(TermContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterSwordWorldRollModifier(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitSwordWorldRollModifier(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitSwordWorldRollModifier(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.SwordWorldRollModifierContext = SwordWorldRollModifierContext;

class TargetNumberAndRaiseStepContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_targetNumberAndRaiseStep;
        this.tnr = null; // TermContext
        this.tt = null; // TermContext
        this.tr = null; // TermContext
        this.tgtn = null; // TermContext
    }

	term = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(TermContext);
	    } else {
	        return this.getTypedRuleContext(TermContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterTargetNumberAndRaiseStep(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitTargetNumberAndRaiseStep(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitTargetNumberAndRaiseStep(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class AdditiveModifierContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_additiveModifier;
        this.op = null; // Token
        this.em = null; // ExpressionContext
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterAdditiveModifier(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitAdditiveModifier(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitAdditiveModifier(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class FudgeRollContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_fudgeRoll;
        this.t = null; // TermContext
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterFudgeRoll(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitFudgeRoll(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitFudgeRoll(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class CarcosaRollContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_carcosaRoll;
        this.t = null; // TermContext
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterCarcosaRoll(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitCarcosaRoll(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitCarcosaRoll(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class WegD6RollContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_wegD6Roll;
        this.t = null; // TermContext
    }

	term() {
	    return this.getTypedRuleContext(TermContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterWegD6Roll(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitWegD6Roll(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitWegD6Roll(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class TermContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = R2Parser.RULE_term;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class ExprTermContext extends TermContext {

    constructor(parser, ctx) {
        super(parser);
        this.comment = null; // Token;
        this.e = null; // ExpressionContext;
        super.copyFrom(ctx);
    }

	expression() {
	    return this.getTypedRuleContext(ExpressionContext,0);
	};

	STRING() {
	    return this.getToken(R2Parser.STRING, 0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterExprTerm(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitExprTerm(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitExprTerm(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.ExprTermContext = ExprTermContext;

class IntTermContext extends TermContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null; // Token;
        super.copyFrom(ctx);
    }

	INT() {
	    return this.getToken(R2Parser.INT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterIntTerm(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitIntTerm(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitIntTerm(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.IntTermContext = IntTermContext;

class VarTermContext extends TermContext {

    constructor(parser, ctx) {
        super(parser);
        this.v = null; // Token;
        super.copyFrom(ctx);
    }

	VAR() {
	    return this.getToken(R2Parser.VAR, 0);
	};

	enterRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.enterVarTerm(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof R2Listener ) {
	        listener.exitVarTerm(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof R2Visitor ) {
	        return visitor.visitVarTerm(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

R2Parser.VarTermContext = VarTermContext;


R2Parser.CommandElementContext = CommandElementContext; 
R2Parser.StatementContext = StatementContext; 
R2Parser.BatchElementContext = BatchElementContext; 
R2Parser.ExpressionContext = ExpressionContext; 
R2Parser.GenericRollContext = GenericRollContext; 
R2Parser.DieFacetsTermContext = DieFacetsTermContext; 
R2Parser.GenericRollSuffixContext = GenericRollSuffixContext; 
R2Parser.SavageWorldsRollContext = SavageWorldsRollContext; 
R2Parser.SavageWorldsExtrasRollContext = SavageWorldsExtrasRollContext; 
R2Parser.SwordWorldPowerRollContext = SwordWorldPowerRollContext; 
R2Parser.SwordWorldPowerRollModifierContext = SwordWorldPowerRollModifierContext; 
R2Parser.TargetNumberAndRaiseStepContext = TargetNumberAndRaiseStepContext; 
R2Parser.AdditiveModifierContext = AdditiveModifierContext; 
R2Parser.FudgeRollContext = FudgeRollContext; 
R2Parser.CarcosaRollContext = CarcosaRollContext; 
R2Parser.WegD6RollContext = WegD6RollContext; 
R2Parser.TermContext = TermContext; 
